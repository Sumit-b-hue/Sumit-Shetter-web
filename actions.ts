"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ---------------------------------- AUTH --------------------------------- */

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}

/* -------------------------------- STORAGE --------------------------------- */
// Uploads a file to a public Supabase Storage bucket and returns its public URL.
// Buckets used: "thumbnails", "videos", "avatars" (created by supabase/schema.sql)

export async function uploadFile(bucket: string, file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/* -------------------------------- PROJECTS -------------------------------- */

export async function saveProject(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");

  const thumbnailFile = formData.get("thumbnail_file") as File | null;
  const videoFile = formData.get("video_file") as File | null;

  let thumbnail_url = String(formData.get("thumbnail_url") || "");
  let video_url = String(formData.get("video_url") || "");

  if (thumbnailFile && thumbnailFile.size > 0) {
    thumbnail_url = await uploadFile("thumbnails", thumbnailFile);
  }
  if (videoFile && videoFile.size > 0) {
    video_url = await uploadFile("videos", videoFile);
  }

  const payload = {
    title: String(formData.get("title") || ""),
    category: String(formData.get("category") || "Custom"),
    client: String(formData.get("client") || ""),
    year: Number(formData.get("year") || new Date().getFullYear()),
    software: String(formData.get("software") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    description: String(formData.get("description") || ""),
    thumbnail_url,
    video_url,
    sort_order: Number(formData.get("sort_order") || 0),
    published: formData.get("published") === "on",
  };

  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("projects").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
}

export async function deleteProject(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/projects");
}

/* -------------------------------- SERVICES -------------------------------- */

export async function saveService(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");

  const payload = {
    name: String(formData.get("name") || ""),
    price_label: String(formData.get("price_label") || ""),
    description: String(formData.get("description") || ""),
    features: String(formData.get("features") || "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    featured: formData.get("featured") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
  };

  if (id) {
    const { error } = await supabase.from("services").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("services").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/services");
}

export async function deleteService(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/services");
}

/* ------------------------------ TESTIMONIALS ------------------------------ */

export async function saveTestimonial(formData: FormData) {
  const supabase = createClient();
  const id = String(formData.get("id") || "");

  const avatarFile = formData.get("avatar_file") as File | null;
  let avatar_url = String(formData.get("avatar_url") || "") || null;
  if (avatarFile && avatarFile.size > 0) {
    avatar_url = await uploadFile("avatars", avatarFile);
  }

  const payload = {
    client_name: String(formData.get("client_name") || ""),
    client_role: String(formData.get("client_role") || ""),
    quote: String(formData.get("quote") || ""),
    avatar_url,
    rating: Number(formData.get("rating") || 5),
    sort_order: Number(formData.get("sort_order") || 0),
  };

  if (id) {
    const { error } = await supabase.from("testimonials").update(payload).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("testimonials").insert(payload);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

/* -------------------------------- SETTINGS -------------------------------- */

export async function saveSettings(formData: FormData) {
  const supabase = createClient();

  const payload = {
    id: 1,
    hero_name: String(formData.get("hero_name") || ""),
    hero_tagline: String(formData.get("hero_tagline") || ""),
    about_bio: String(formData.get("about_bio") || ""),
    years_experience: Number(formData.get("years_experience") || 0),
    projects_completed: Number(formData.get("projects_completed") || 0),
    happy_clients: Number(formData.get("happy_clients") || 0),
    email: String(formData.get("email") || ""),
    whatsapp: String(formData.get("whatsapp") || ""),
    instagram: String(formData.get("instagram") || ""),
    linkedin: String(formData.get("linkedin") || ""),
    availability_status: String(formData.get("availability_status") || "Available"),
  };

  const { error } = await supabase.from("site_settings").upsert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

/* -------------------------------- MESSAGES -------------------------------- */

export async function submitContactForm(formData: FormData) {
  const supabase = createClient();

  const payload = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    project_type: String(formData.get("project_type") || ""),
    budget: String(formData.get("budget") || ""),
    message: String(formData.get("message") || ""),
    read: false,
  };

  if (!payload.name || !payload.email || !payload.message) {
    return { error: "Please fill in your name, email, and message." };
  }

  const { error } = await supabase.from("messages").insert(payload);
  if (error) return { error: error.message };

  return { success: true };
}

export async function markMessageRead(id: string, read: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("messages").update({ read }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}
