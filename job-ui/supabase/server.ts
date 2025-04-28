// @ts-nocheck

// Deno server to handle Supabase Edge Functions
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const FUNCTIONS_PATH = Deno.env.get("FUNCTIONS_PATH") || "/home/deno/functions";
const PORT = 9000;

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

/**
 * This is a simple router for Edge Functions
 * It maps URLs like /functions/v1/function-name to the corresponding function handler
 */
console.log(`Starting Edge Functions server on port ${PORT}`);
console.log(`Functions directory: ${FUNCTIONS_PATH}`);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: new Headers(corsHeaders),
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    
    // Log the incoming request
    console.log(`${req.method} ${path}`);
    
    // Parse the function name from the path
    // Expected format: /functions/v1/function-name
    const functionNameMatch = path.match(/\/functions\/v1\/([^\/]+)/);
    
    if (!functionNameMatch) {
      console.error(`Invalid function path: ${path}`);
      return new Response(JSON.stringify({ error: "Invalid function path" }), {
        status: 404,
        headers: new Headers({
          ...corsHeaders,
          "Content-Type": "application/json",
        }),
      });
    }
    
    const functionName = functionNameMatch[1];
    console.log(`Function requested: ${functionName}`);
    
    // Check if the function exists
    const functionDir = `${FUNCTIONS_PATH}/${functionName}`;
    
    try {
      // Try to dynamically import the function
      const mod = await import(`file://${functionDir}/index.ts`);
      
      // If the function module has a serve method, call it
      if (mod.serve && typeof mod.serve === "function") {
        const response = await mod.serve(req);
        
        // Add CORS headers to the response if they're not already present
        const headers = new Headers(response.headers);
        Object.entries(corsHeaders).forEach(([key, value]) => {
          if (!headers.has(key)) {
            headers.set(key, value);
          }
        });
        
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } else {
        console.error(`Function ${functionName} does not export a serve method`);
        return new Response(JSON.stringify({ error: "Function not properly implemented" }), {
          status: 500,
          headers: new Headers({
            ...corsHeaders,
            "Content-Type": "application/json",
          }),
        });
      }
    } catch (error) {
      console.error(`Error loading function ${functionName}:`, error);
      return new Response(JSON.stringify({ error: `Function not found: ${functionName}` }), {
        status: 404,
        headers: new Headers({
          ...corsHeaders,
          "Content-Type": "application/json",
        }),
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: new Headers({
        ...corsHeaders,
        "Content-Type": "application/json",
      }),
    });
  }
}, { port: PORT });

console.log(`Edge Functions server started at http://localhost:${PORT}`);

