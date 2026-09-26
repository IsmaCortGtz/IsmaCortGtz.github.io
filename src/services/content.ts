import type { Profile, Skills, UIContent } from "@/interfaces/Content";
import { getEntry } from "astro:content";

/**
 * Loads a generic collection entry by language key.
 */
export async function loadCollectionData<T>(collection: "profile" | "skills" | "ui", lang: string): Promise<T> {
  const collectionEntry = await getEntry(collection, lang);
  if (!collectionEntry) {
    throw new Error(`Collection entry "${collection}" for language "${lang}" not found`);
  }

  const { data } = collectionEntry;
  if (!data) {
    throw new Error(`Data for collection "${collection}" (${lang}) is empty`);
  }

  return data as T;
}

/**
 * Loads profile information for the specified language.
 */
export async function loadProfile(lang: string): Promise<Profile> {
  return loadCollectionData<Profile>("profile", lang);
}

/**
 * Loads skills grouped by categories for the specified language.
 */
export async function loadSkills(lang: string): Promise<Skills> {
  return loadCollectionData<Skills>("skills", lang);
}

/**
 * Loads UI translation strings for the specified language.
 */
export async function loadUI(lang: string): Promise<UIContent> {
  const ui = await getEntry("ui", lang);
  if (!ui) {
    throw new Error(`UI collection not found for language "${lang}"`);
  }

  return ui.data as UIContent;
}
