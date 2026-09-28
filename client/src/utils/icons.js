// Maps a stored icon *name* (string, safe to keep in the database) to a real
// lucide-react icon component. Used for program cards, where the admin can pick
// an icon by name. Unknown names fall back to a neutral sparkle.
import {
  Users, Scissors, GraduationCap, HeartPulse, Utensils, Sprout,
  Heart, HeartHandshake, BookOpen, Stethoscope, Leaf, Droplets,
  Baby, Wheat, Sun, HandHelping, Home, Sparkles,
} from 'lucide-react';

export const iconMap = {
  Users, Scissors, GraduationCap, HeartPulse, Utensils, Sprout,
  Heart, HeartHandshake, BookOpen, Stethoscope, Leaf, Droplets,
  Baby, Wheat, Sun, HandHelping, Home, Sparkles,
};

// Names offered in the admin "choose an icon" dropdown.
export const iconNames = Object.keys(iconMap);

export const getIcon = (name) => iconMap[name] || Sparkles;
