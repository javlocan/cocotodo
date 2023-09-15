"use client";

import React, { useContext, useRef, PropsWithChildren } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { usePathname } from "next/navigation";

import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context";

function FrozenRouter(props: PropsWithChildren<{}>) {
  const context = useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}
export const PageTransitionWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="scroller"
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, type: "tween" }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
      {/*     <motion.div
        key={pathname + "1"}
        className="slide-in"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.5 }}
      ></motion.div>
      <motion.div
        key={pathname + "2"}
        className="slide-out"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.5 }}
      ></motion.div> */}
    </AnimatePresence>
  );
};
