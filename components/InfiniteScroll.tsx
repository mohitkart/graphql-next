import { useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function InfiniteScroll({children,load}: {children: any,load: ()=>void}) {
    const loaderRef = useRef<HTMLDivElement>(null);

    const loadMore = () => {
        console.log("Load more items...");
        load()
  };    

    useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, []);

    return <div ref={loaderRef}>
        {children}
    </div>;
}