const AppLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="relative">
        <svg
          width="180"
          height="180"
          viewBox="0 0 140 140"
          className="relative z-10"
        >
          <defs>
            <clipPath id="circle-clip">
              <circle cx="70" cy="70" r="75" />
            </clipPath>

            <clipPath id="k-clip">
              <path
                d="M40 30 L40 110 L52 110 L52 78 L78 110 L92 110 L68 78 L88 30 L72 30 L62 68 L55 62 L55 30 Z"
                fill="black"
              />
            </clipPath>

            <linearGradient
              id="liquidGradient"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#f97316">
                <animate
                  attributeName="stop-color"
                  values="#f97316;#fb7185;#3b82f6;#f97316"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#fb923c">
                <animate
                  attributeName="stop-color"
                  values="#fb923c;#8b5cf6;#10b981;#fb923c"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#fdba74">
                <animate
                  attributeName="stop-color"
                  values="#fdba74;#f43f5e;#2563eb;#fdba74"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            <mask id="liquid-mask">
              {/* Adjusted rectangle to match liquid rect position */}
              <rect x="40" y="110" width="52" height="80" fill="white">
                <animate
                  attributeName="y"
                  from="110"
                  to="50"
                  dur="3s"
                  repeatCount="indefinite"
                  fill="freeze"
                />
              </rect>
            </mask>
          </defs>

          {/* Bigger K outline */}
          <path
            d="M40 30 L40 110 L52 110 L52 78 L78 110 L92 110 L68 78 L88 30 L72 30 L62 68 L55 62 L55 30 Z"
            fill="none"
            stroke="#1f2937"
            strokeWidth="2"
            clipPath="url(#circle-clip)"
          />

          {/* Liquid fill - shifted and sized to cover the K fully */}
          <rect
            x="40"
            y="30"
            width="52"
            height="100"
            clipPath="url(#k-clip)"
            mask="url(#liquid-mask)"
            fill="url(#liquidGradient)"
          />

          {/* Bubbles - positioned inside the liquid area */}
          {[...Array(6)].map((_, i) => {
            const cx = 45 + i * 8; // fit within 40 to 92
            const delay = i * 0.5;
            return (
              <circle
                key={i}
                cx={cx}
                cy="100" // start near bottom of liquid rect
                r="4"
                fill="white"
                opacity="0.6"
              >
                <animate
                  attributeName="cy"
                  values="100;60" // rise upwards within liquid area
                  dur="3s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.6;0"
                  dur="3s"
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}
        </svg>

        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default AppLoader;
