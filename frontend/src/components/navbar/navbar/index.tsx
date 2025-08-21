import { ElementOne } from '../svg/elementOne'
import { ElementTwo } from '../svg/elementTwo'
import React, { useState, useRef, useEffect } from "react";
import  styles  from "./index.module.css"; 
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  id: string;
  svg: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { id: "overview", svg: <ElementOne width="2vw" height="2vw" />, path: '/overview' },
  { id: "list", svg: <ElementTwo width="2vw" height="2vw" />, path: '/list' },
  { id: "three", svg: <ElementOne width="2vw" height="2vw" />, path: '/three' },
  { id: "four", svg: <ElementTwo width="2vw" height="2vw" /> , path: '/four'},
];

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const navigate = useNavigate()
  const nowLoc = useLocation()

  useEffect(() => {
    if (!containerRef.current) {
        return;
    }
    const activeItem = itemsRef.current[activeIndex];
    if (activeItem) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      setBgStyle({
        width: itemRect.width,
        height: itemRect.height,
        transform: `translateY(${itemRect.top - containerRect.top}px)`,
      });
    }
  }, [activeIndex]);

  
  // Синхронизация, если URL меняется извне (например, вручную)
  useEffect(() => {
    const idx = navItems.findIndex(item => item.path === nowLoc.pathname);
    if (idx !== -1 && idx !== activeIndex) {
      setActiveIndex(idx);
    }
  }, [nowLoc.pathname, activeIndex]);

  return (
    <div ref={containerRef} className={styles.navbar}>
      <div className={styles.navbarActiveBg} style={bgStyle} />

      {navItems.map((item, i) => (
        <button
          key={item.id}
          ref={(el) => {
            itemsRef.current[i] = el;
          }}
          onClick={() => {
            setActiveIndex(i)
            navigate(item.path)
        }}
          className={styles.navbarButton}
          aria-current={activeIndex === i ? "page" : undefined}
          aria-label={item.id}
        >
          {item.svg}
        </button>
      ))}
    </div>
  );
}




// import { ElementOne } from '../svg/elementOne'
// import { ElementTwo } from '../svg/elementTwo'
// import styles from './index.module.css'

// export const NavBar = () => {
//     return (
//         <nav className={styles.navbar}>
//             <ul><ElementOne width='2vw' height='2vw'/></ul>
//             <ul><ElementTwo width='2vw' height='2vw'/></ul>
//         </nav>
//     )
// }