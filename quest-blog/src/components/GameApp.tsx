"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Clock3,
  Github,
  GraduationCap,
  MapPin,
  Orbit,
  Play,
  Sprout,
  Telescope,
  X,
  Youtube,
} from "lucide-react";
import type { Quest } from "@/lib/quests";
import { GraphPreview } from "@/components/GraphPreview";

const outbound = { target: "_blank", rel: "noopener noreferrer" };
const videoUrl = "https://www.youtube.com/watch?v=ww071PvcVqk&t=28s";

function Planet() {
  const pixels = [];
  for (let y = -13; y <= 13; y++) {
    for (let x = -13; x <= 13; x++) {
      if (x * x + y * y > 175) continue;
      const land =
        Math.sin(x * 0.47 + y * 0.35) + Math.cos(y * 0.6 - x * 0.24) > 0.55;
      const shade = x * 0.7 + y * 0.6;
      const color = land
        ? shade < -3
          ? "#bbdf8c"
          : shade < 7
            ? "#70b894"
            : "#356d71"
        : shade < -4
          ? "#668aac"
          : shade < 6
            ? "#3c597d"
            : "#273956";
      pixels.push(
        <rect
          key={`${x}-${y}`}
          x={238 + x * 9}
          y={202 + y * 9}
          width="9"
          height="9"
          fill={color}
        />,
      );
    }
  }
  return (
    <div className="planet-scene">
      <svg
        className="planet-art"
        viewBox="0 0 500 440"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="243"
          cy="207"
          r="172"
          stroke="#29364a"
          strokeDasharray="3 9"
        />
        <ellipse
          cx="243"
          cy="215"
          rx="224"
          ry="70"
          transform="rotate(-23 243 215)"
          stroke="#546178"
        />
        <g shapeRendering="crispEdges">{pixels}</g>
        <path
          d="M43 274c24 31 139 10 249-36s183-100 163-124"
          stroke="#aab69b"
          strokeWidth="2"
        />
        <g fill="#d5e8a6">
          <path d="M407 65h5v5h5v5h-5v5h-5v-5h-5v-5h5zM95 331h4v4h4v4h-4v4h-4v-4h-4v-4h4z" />
          <rect x="68" y="125" width="4" height="4" />
          <rect x="393" y="332" width="4" height="4" />
        </g>
        <g fill="#7980b6">
          <rect x="150" y="43" width="4" height="4" />
          <rect x="444" y="262" width="4" height="4" />
          <rect x="190" y="383" width="4" height="4" />
        </g>
        <path d="M205 85v-23h5v-6h5v6h5v23z" fill="#e9e6cf" />
        <path d="M200 82h5v10h-5zm20 0h5v10h-5z" fill="#a9c779" />
        <path d="M210 89h5v14h-5" fill="#eac28a" />
      </svg>
    </div>
  );
}

export default function GameApp({ quests }: { quests: Quest[] }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const posterRef = useRef<HTMLButtonElement>(null);
  const closeVideoRef = useRef<HTMLButtonElement>(null);
  const videoWasOpened = useRef(false);
  useEffect(() => {
    if (videoOpen) {
      videoWasOpened.current = true;
      closeVideoRef.current?.focus({ preventScroll: true });
    } else if (videoWasOpened.current) {
      posterRef.current?.focus({ preventScroll: true });
    }
  }, [videoOpen]);
  return (
    <div
      className="planet-blog"
      id="top"
      onKeyDown={(event) => {
        if (event.key === "Escape" && videoOpen) setVideoOpen(false);
      }}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="wordmark">
            <span className="monogram" aria-hidden="true">
              yy<span>✦</span>
            </span>
            <span>Ying Yao</span>
          </Link>
          <div className="nav-links">
            <a href="#quests">Quest Log</a>
            <a href="#about">About</a>
            <a href="#inventory">Inventory</a>
          </div>
          <a
            className="nav-github"
            href="https://github.com/shakewingo"
            {...outbound}
            aria-label="Ying Yao on GitHub (opens in a new tab)"
          >
            <Github size={18} />
            <ArrowUpRight size={12} />
          </a>
        </div>
      </nav>

      <main id="main">
        <header className="hero page-width">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="pixel-star">✦</span> WELCOME TO MY LITTLE PLANET
            </p>
            <h1>
              Hi, I’m
              <br />
              <span>Ying Yao.</span>
              <span className="cursor" aria-hidden="true">
                _
              </span>
            </h1>
            <p className="hero-description">
              An ML engineer with a curious mind.
              <br />
              Exploring AI, building things, and connecting
              <br className="desktop-break" /> the dots along the way.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#quests">
                Quest Log <ArrowDown size={16} />
              </a>
              <a className="text-link" href="#inventory">
                Inventory <ArrowUpRight size={15} />
              </a>
            </div>
            <p className="hero-footnote">
              <MapPin size={13} /> Hangzhou, China
            </p>
          </div>
          <Planet />
        </header>

        <section
          id="quests"
          className="journal-section section page-width"
          aria-labelledby="journal-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="journal-title">
                Quest Log<span className="heading-dot">.</span>
              </h2>
            </div>
          </div>
          <div className="post-list">
            {quests.map((quest, index) => (
              <Link
                className="post-card"
                href={`/quests/${quest.slug}/#article-top`}
                key={quest.slug}
              >
                <span className="post-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="post-body">
                  <div className="post-meta">
                    <time dateTime={quest.date}>
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      }).format(new Date(quest.date))}
                    </time>
                    <span>·</span>
                    <span>
                      <Clock3 size={13} /> {quest.readingMinutes} min read
                    </span>
                  </div>
                  <h3>{quest.title}</h3>
                  <p>{quest.summary}</p>
                  <span className="read-link">
                    Read article <ArrowRight size={15} />
                  </span>
                </div>
                <div className="post-symbol" aria-hidden="true">
                  {quest.slug === "gd-vs-ols" ? (
                    <>
                      <span>∇</span>
                    </>
                  ) : (
                    <BookOpen size={45} />
                  )}
                </div>
              </Link>
            ))}
            {quests.length === 0 && (
              <p className="empty-journal">
                No published notes yet. Explore the projects below in the
                meantime.
              </p>
            )}
          </div>
        </section>

        <section
          id="about"
          className="about-section section"
          aria-labelledby="about-title"
        >
          <div className="page-width">
            <div className="section-heading">
              <div>
                <h2 id="about-title">
                  About<span className="heading-dot">.</span>
                </h2>
              </div>
            </div>
            <div className="about-grid">
              <div className="about-intro">
                <div className="passport-mark" aria-hidden="true">
                  <Orbit size={35} />
                </div>
                <h3>
                  From patterns in data
                  <br />
                  to systems that learn.
                </h3>
                <p>
                  My path has taken me from mathematics and statistics to energy
                  forecasting and production ML. At Zoom, I helped build anomaly
                  detection and root cause analysis systems.
                </p>
                <p>
                  These days, I’m exploring AI agents, memory, and reinforcement
                  learning — and keeping notes as I go.
                </p>
                <div className="interest-tags">
                  <span>Agentic AI</span>
                  <span>Reinforcement learning</span>
                  <span>AIOps</span>
                </div>
                <div className="education-note">
                  <GraduationCap size={19} />
                  <p>
                    <strong>Education</strong>
                    <br />
                    M.S. Computer Science · Georgia Tech
                    <br />
                    M.S. Probability & Statistics · Carleton
                  </p>
                </div>
              </div>
              <div className="journey">
                <p className="eyebrow journey-label">
                  <BriefcaseBusiness size={13} /> Experience
                </p>
                <ol>
                  <li>
                    <span className="journey-node" />
                    <div className="journey-top">
                      <h3>Zoom</h3>
                      <span>2021 — 2025</span>
                    </div>
                    <p className="journey-role">
                      Machine Learning Engineer · Hangzhou
                    </p>
                    <p>
                      Built time series anomaly detection across 80+ services
                      and 500+ monitors, alongside work on root cause analysis
                      and agent workflows.
                    </p>
                  </li>
                  <li>
                    <span className="journey-node" />
                    <div className="journey-top">
                      <h3>BluWave-ai</h3>
                      <span>2019 — 2021</span>
                    </div>
                    <p className="journey-role">Data Scientist · Ottawa</p>
                    <p>
                      Turned wind, solar, and energy demand data into forecasts
                      for real-world energy decisions.
                    </p>
                  </li>
                  <li>
                    <span className="journey-node" />
                    <div className="journey-top">
                      <h3>Carleton University · CQADS</h3>
                      <span>2018 — 2019</span>
                    </div>
                    <p className="journey-role">Research Associate · Ottawa</p>
                    <p>
                      Applied data science to forecasting, computer vision, and
                      recommendation systems.
                    </p>
                  </li>
                  <li>
                    <span className="journey-node" />
                    <div className="journey-top">
                      <h3>TD Bank Group</h3>
                      <span>2016 — 2018</span>
                    </div>
                    <p className="journey-role">
                      BI & Reporting Analyst II · Ottawa
                    </p>
                    <p>
                      Made reporting more useful — and reduced reporting time by
                      over 30% through automation.
                    </p>
                  </li>
                </ol>
              </div>
            </div>
            <div className="research-note">
              <Telescope size={23} />
              <div>
                <span className="eyebrow">Research</span>
                <p>
                  Reinforcement learning meets sustainable land use in the Lake
                  Malawi Basin.
                </p>
              </div>
              <a
                className="research-meta research-link"
                href="https://arxiv.org/abs/2604.03768"
                {...outbound}
              >
                2026 · Read the preprint <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

        <section
          id="inventory"
          className="inventory-section section page-width"
          aria-labelledby="inventory-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="inventory-title">
                Inventory<span className="heading-dot">.</span>
              </h2>
            </div>
          </div>
          <div className="project-grid">
            <article className="project-card rally-card">
              <div className="project-visual rally-visual">
                {videoOpen ? (
                  <div className="video-player">
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/ww071PvcVqk?start=28&autoplay=1"
                      title="Rally intro — your memory-first AI tennis coach"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <button
                      ref={closeVideoRef}
                      className="close-video"
                      onClick={() => setVideoOpen(false)}
                      aria-label="Close Rally video"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    ref={posterRef}
                    className="video-poster"
                    onClick={() => setVideoOpen(true)}
                    aria-label="Play Rally introduction video from 28 seconds"
                  >
                    <Image
                      src="/images/rally-video.jpg"
                      alt="Rally’s tennis coaching dashboard, shown in Ying Yao’s project introduction"
                      width={1280}
                      height={720}
                      sizes="(max-width: 760px) 100vw, 550px"
                    />
                    <span className="play-button">
                      <Play size={20} fill="currentColor" />
                    </span>
                    <span className="video-poster-label">
                      Play video <ArrowUpRight size={12} />
                    </span>
                  </button>
                )}
              </div>
              <div className="project-content">
                <h3>
                  Rally
                  <span className="tennis-ball" aria-hidden="true" />
                </h3>
                <p className="project-subtitle">
                  Your tennis game, remembered.
                </p>
                <p>
                  Training notes and video become a lasting memory of your game.
                  Rally connects patterns across sessions and builds a personal
                  briefing for the next time you step on court.
                </p>
                <div className="project-tags">
                  <span>AI agents</span>
                  <span>Long-term memory</span>
                  <span>Multimodal</span>
                </div>
                <div className="project-detail">
                  <p>
                    Qwen Cloud Hackathon · MemoryAgent track
                    <br />
                    Designed and built as a solo project.
                  </p>
                </div>
                <div className="project-links">
                  <a href="https://github.com/shakewingo/Rally" {...outbound}>
                    <Github size={16} /> GitHub <ArrowUpRight size={14} />
                  </a>
                  <a href={videoUrl} {...outbound}>
                    <Play size={14} /> Watch on YouTube
                  </a>
                </div>
              </div>
            </article>
            <article className="project-card wiki-card">
              <Link
                className="project-visual garden-visual"
                href="/garden/"
                aria-label="Open LLM-Wiki knowledge graph"
              >
                <GraphPreview />
              </Link>
              <div className="project-content">
                <h3>
                  LLM-Wiki <Sprout size={25} />
                </h3>
                <p className="project-subtitle">
                  My AI learning notes, connected.
                </p>
                <p>
                  Notes from Algorithm, Engineering, ML Course, and Alisa’s LLM
                  notebook. Explore their connections and read the notes.
                </p>
                <div className="project-tags">
                  <span>AI learning</span>
                  <span>Obsidian</span>
                  <span>Knowledge graph</span>
                </div>
                <div className="project-links">
                  <Link href="/garden/">
                    <BookOpen size={16} /> Open LLM-Wiki{" "}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width">
          <div className="footer-top">
            <div>
              <h2>
                Have fun<span>!</span>
              </h2>
            </div>
            <div className="footer-channels">
              <a href="https://github.com/shakewingo" {...outbound}>
                <Github size={18} /> GitHub <ArrowUpRight size={15} />
              </a>
              <a href="https://www.youtube.com/@shakewingo3216" {...outbound}>
                <Youtube size={18} /> YouTube <ArrowUpRight size={15} />
              </a>
              <a
                href="https://space.bilibili.com/3493135200029088"
                {...outbound}
              >
                <span className="bili-icon" aria-hidden="true">
                  ▣
                </span>{" "}
                Bilibili <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Ying Yao</span>
            <Link href="/privacy-policy/">MoneyInOne privacy</Link>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
