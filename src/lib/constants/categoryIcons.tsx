import {
  Armchair,
  Bot,
  Briefcase,
  Building2,
  Car,
  Code2,
  Flame,
  Grid3x3,
  Hammer,
  Headset,
  Layers,
  Megaphone,
  Paintbrush,
  Palette,
  PenTool,
  Shirt,
  Sofa,
  Video,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/** Maps the `icon` string stored on each category row (see 0015_category_content.sql) to its component. */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  Hammer,
  Zap,
  Wrench,
  Building2,
  Flame,
  Paintbrush,
  Layers,
  Grid3x3,
  Car,
  Sofa,
  Shirt,
  Armchair,
  Code2,
  Palette,
  Megaphone,
  PenTool,
  Video,
  Headset,
  Bot,
};

export function categoryIcon(name: string | null | undefined): LucideIcon {
  return (name && CATEGORY_ICON_MAP[name]) || Briefcase;
}
