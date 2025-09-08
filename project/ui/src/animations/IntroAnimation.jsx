import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Typography } from "@mui/material";

export default function IntroAnimation() {
  const overlayRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.set(overlayRef.current, { autoAlpha: 1 });

    gsap.set(overlayRef.current, {
      "--ovRev": "0%",
      WebkitMaskImage: "linear-gradient(135deg, rgba(0,0,0,0) calc(var(--ovRev) - 12%), rgba(0,0,0,1) var(--ovRev), rgba(0,0,0,1) 200%)",
      maskImage: "linear-gradient(135deg, rgba(0,0,0,0) calc(var(--ovRev) - 12%), rgba(0,0,0,1) var(--ovRev), rgba(0,0,0,1) 200%)",
    });

    gsap.set(iconRef.current, { autoAlpha: 0, x: '82px', y: 0, scale: 1, transformOrigin: "center center" });
    gsap.set(textRef.current, { autoAlpha: 0, "--rev": "0%" });

    const tl = gsap.timeline({ onComplete: () => console.log("done") });

    // 1) bulb blink
    tl.to(iconRef.current, {
      delay: 0.5,
      duration: 1.2,
      ease: "none",
      keyframes: [
        { autoAlpha: 1, duration: 0.04 },
        { autoAlpha: 0, duration: 0.03 },
        { autoAlpha: 1, duration: 0.03 },
        { autoAlpha: 0, duration: 0.03 },
        { autoAlpha: 1, duration: 0.05 },
        { autoAlpha: 0, duration: 0.05 },
        { autoAlpha: 1, duration: 0.08 },
        { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
      ],
    });

    // 2) diagonal text reveal (10% soft band) + icon slides left; both end centered
    tl.fromTo(
      textRef.current,
      { x: 180, autoAlpha: 0, "--rev": "0%" },
      {
        duration: 1.2,
        x: 50,
        autoAlpha: 1,
        "--rev": "120%", // sweep fully past the right edge
        ease: "power3.out",
      },
      "-=0.3"
    ).to(
      iconRef.current,
      {
        duration: 1.2,
        x: -90,
        ease: "power3.out",
      },
      "<"
    );

    // 3) move & scale, then 4) diagonal sweep, then 5) remove overlay
    tl.add(() => {
      const headerIcon = document.querySelector('header img[alt="logo"]');
      const headerTitle = document.querySelector('header h4');
      if (!headerIcon || !headerTitle) return;

      const r = (el) => el.getBoundingClientRect();
      const ctr = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

      // icon deltas
      const iNow = r(iconRef.current), iHdr = r(headerIcon);
      const iDX = ctr(iHdr).x - ctr(iNow).x;
      const iDY = ctr(iHdr).y - ctr(iNow).y;
      const iScale = iHdr.width / iNow.width;

      // text deltas
      const tNow = r(textRef.current), tHdr = r(headerTitle);
      const tDX = ctr(tHdr).x - ctr(tNow).x;
      const tDY = ctr(tHdr).y - ctr(tNow).y;

      // local timeline ensures 4&5 wait for 3 to complete
      const t3 = gsap.timeline();

      // (3) move/scale to header
      t3.to(iconRef.current, {
        duration: 0.9,
        x: `+=${iDX}`,
        y: `+=${iDY}`,
        scale: iScale,
        ease: "power3.inOut"
      }, "+=0.1")
      .to(textRef.current, {
        duration: 0.9,
        x: `+=${tDX}`,
        y: `+=${tDY}`,
        scale: 1,
        ease: "power3.inOut"
      }, "<")

      // (4) diagonal shadow sweep reveal (kept identical behavior, now strictly after step 3)
      .to(overlayRef.current, {
        duration: 1.6,
        "--ovRev": "140%",
        ease: "power2.inOut",
      }, "+=0.05")

      // (5) remove from DOM & interactions
      .to(overlayRef.current, {
        duration: 0.12,
        autoAlpha: 0,
        onStart: () => gsap.set(overlayRef.current, { pointerEvents: "none" }),
        onComplete: () => overlayRef.current && overlayRef.current.remove(),
      }, "-=0.02");
    });

  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "32px",
        userSelect: 'none'
      }}
    >
      <img
        ref={iconRef}
        src="/timeline.svg"
        alt="logo"
        style={{ width: 100, height: 100 }}
      />

      {/* Same typography variant (h4) but scaled up for the intro */}
      <Typography
        ref={textRef}
        variant="h4"
        sx={{
          m: 0,
          fontWeight: "bold",
          color: "primary.main",
          transform: "scale(3.56)",
          WebkitMaskImage: "linear-gradient(135deg, rgba(0,0,0,1) calc(var(--rev) - 10%), rgba(0,0,0,1) var(--rev), rgba(0,0,0,0) calc(var(--rev) + 0.001%))",
          maskImage: "linear-gradient(135deg, rgba(0,0,0,1) calc(var(--rev) - 10%), rgba(0,0,0,1) var(--rev), rgba(0,0,0,0) calc(var(--rev) + 0.001%))",
        }}
      >
        Timeline
      </Typography>
    </div>
  );
}
