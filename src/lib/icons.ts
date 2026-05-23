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
  SiDocker,
  SiGit,
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
  docker: SiDocker,
  git: SiGit,
  "expo-orbit": SiExpo,
  warp: SiWarp,
  "github-desktop": FaGithub,
};
