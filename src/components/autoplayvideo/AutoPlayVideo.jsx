import React, { useRef, useEffect, useState } from "react";

export const autoPlayVideo = ({ url }) => {
    
    const videoRef = useRef();
    const [playVideo, setPlayVideo] = useState(false);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5, // Play when 50% of the video is visible in the viewport
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setPlayVideo(true);
                } else {
                    setPlayVideo(false);
                }
            });
        }, options);

        observer.observe(videoRef.current);

        return () => observer.unobserve(videoRef.current);
    }, []);

    return (
        <div ref={videoRef}>
            <video
                src={url}
                width="100%"
                height="100%"
                loop
                muted
                autoPlay={playVideo}
                playsInline
            />
        </div>
    );
};