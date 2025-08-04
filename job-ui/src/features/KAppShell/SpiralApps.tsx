import { cn } from "@/lib/utils";
import { IApp } from "@/shared/types/IApp";
import { useRef, useEffect } from "react";

interface SpiralAppsProps {
  apps: IApp[];
}

const SpiralApps: React.FC<SpiralAppsProps> = ({ apps }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nDots = 40;
  const nArms = 6;
  const v = 21;
  const a = 30; // for angle between spirals
  const k = 0.25;
  const u = (2 * Math.PI) / v;
  const m = Math.exp(k * u);
  const d = a * Math.sqrt(1 + m * m - 2 * m * Math.cos(u));
  const c = d / (1 + m);

  useEffect(() => {
    const container = containerRef.current!;
    const children = Array.from(container.children) as HTMLElement[];

    let r = a;
    let f = m;
    const styleSheet = document.styleSheets[0];
    const inserted = new Set<string>();

    for (let j = 0; j < nDots; j++) {
      const r0 = r;
      const f0 = f;
      r = r * m;
      f = +(f * m).toFixed(2);

      for (let i = 0; i < nArms; i++) {
        const index = i * nDots + j;
        const el = children[index];
        if (!el) continue;

        const kVal = i / nArms;
        const angle = kVal * 360 + j * (360 / v);
        const nextAngle = angle + 360 / v;

        const scale = 0.7 + Math.min(1, j / nDots) * 0.8;
        const opacity = 1 - j / nDots;

        const keyframeName = `spiral-${index}`;
        if (!inserted.has(keyframeName)) {
          const rule = `
          @keyframes ${keyframeName} {
            0% {
              transform: rotate(${angle}deg) translate(${r0}px) scale(${scale});
              opacity: ${opacity};
            }
            100% {
              transform: rotate(${nextAngle}deg) translate(${r}px) scale(${f});
              opacity: ${1 - (j + 1) / nDots};
            }
          }
        `;
          try {
            styleSheet.insertRule(rule, styleSheet.cssRules.length);
            inserted.add(keyframeName);
          } catch (err) {
            console.warn("Failed to insert rule:", rule);
          }
        }

        el.style.animation = `${keyframeName} 4s linear infinite`;
        el.classList.add("spiral-animate");
        el.style.transform = `rotate(${angle}deg) translate(${r0}px) scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.gridArea = "1 / 1";
        el.style.placeSelf = "center";
        el.style.position = "relative";
      }
    }

    // ✅ FIX: Add hover listeners to individual icons
    children.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        container.classList.add("pause-spiral");
      });
      el.addEventListener("mouseleave", () => {
        container.classList.remove("pause-spiral");
      });
    });
  }, []);

  const appsToRender = Array.from({ length: nArms * nDots }).map(
    (_, i) => apps[i % apps.length]
  );

  const handleAppClick = (app: IApp) => {
    if (app.isInternal) {
      console.log(`Navigating to internal route: ${app.url}`);
    } else {
      window.open(app.url, "_blank");
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative grid place-content-center overflow-hidden h-screen w-screen"
    >
      {appsToRender.map((app, index) => {
        const IconComponent = app.icon;
        return (
          <div
            key={index}
            onClick={() => handleAppClick(app)}
            className="group absolute  cursor-pointer spiral-animate"
            data-tooltip={app.name}
            style={{
              gridArea: "1 / 1",
              placeSelf: "center",
            }}
          >
            <div
              className={cn(
                "w-3 h-3 rounded-full  p-1  transition-all duration-300 group-hover:scale-110 group-hover:z-10  ",
                "group-hover:w-4 group-hover:h-4 group-hover:rounded-2xl group-hover:bg-orange-500",
                app.color
              )}
            >
              <IconComponent
                size={12}
                className="w-full h-full  group-hover:font-bold group-hover:drop-shadow-md group-hover:stroke-[2]"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SpiralApps;
