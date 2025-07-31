import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface LinkedInAccountCardProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
}

const LinkedInAccountCard: React.FC<LinkedInAccountCardProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>LinkedIn Account</CardTitle>
        <CardDescription>Enter your LinkedIn credentials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInAccountCard;
