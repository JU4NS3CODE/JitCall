import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async uploadFile(file: File, path: string): Promise<string> {
  const { data, error } = await this.supabase.storage
    .from('multimedia')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = this.supabase.storage
    .from('multimedia')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

  getImageUrl(path: string): string {
    const { data } = this.supabase.storage
      .from('multimedia')
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async deleteImage(path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from('multimedia')
      .remove([path]);

    if (error) {
      console.error('❌ Error eliminando imagen:', error.message);
      throw error;
    }
  }
}
