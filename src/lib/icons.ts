/**
 * Centralised icon map for stacks, OS, and tools.
 * Uses react-icons under the hood so cards stay icon-agnostic.
 */
import type { IconType } from "react-icons";
import {
  SiExpo,
  SiReact,
  SiFlutter,
  SiNodedotjs,
  SiPython,
  SiGo,
  SiRust,
  SiApple,
  SiLinux,
  SiAndroidstudio,
  SiXcode,
  SiPostman,
  SiInsomnia,
  SiDocker,
  SiPostgresql,
  SiRedis,
  SiGit,
  SiEslint,
  SiTailwindcss,
  SiStorybook,
  SiVitest,
  SiGooglechrome,
  SiWarp,
} from "react-icons/si";
import { FaWindows, FaGithub } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import type { StackId, OSId, ToolId } from "@/lib/types";

export const stackIcons: Record<StackId, IconType> = {
  expo: SiExpo,
  "react-native": SiReact,
  flutter: SiFlutter,
  node: SiNodedotjs,
  python: SiPython,
  go: SiGo,
  rust: SiRust,
};

export const osIcons: Record<OSId, IconType> = {
  macos: SiApple,
  windows: FaWindows,
  linux: SiLinux,
};

export const toolIcons: Record<ToolId, IconType> = {
  vscode: VscVscode,
  "android-studio": SiAndroidstudio,
  xcode: SiXcode,
  postman: SiPostman,
  insomnia: SiInsomnia,
  docker: SiDocker,
  postgres: SiPostgresql,
  redis: SiRedis,
  git: SiGit,
  "eslint-prettier": SiEslint,
  tailwind: SiTailwindcss,
  storybook: SiStorybook,
  vitest: SiVitest,
  playwright: SiGooglechrome,
  "expo-orbit": SiExpo,
  warp: SiWarp,
  "github-desktop": FaGithub,
};
