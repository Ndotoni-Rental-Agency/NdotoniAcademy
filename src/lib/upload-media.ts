import { GraphQLClient } from '@/lib/graphql-client';
import { getCourseMediaUploadUrl } from '@/graphql/mutations';
import type { GetCourseMediaUploadUrlMutation, GetCourseMediaUploadUrlMutationVariables } from '@/API';

export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

export function mediaTypeFromContentType(contentType: string): MediaType {
  if (contentType.startsWith('video/')) return 'VIDEO';
  if (contentType.startsWith('audio/')) return 'AUDIO';
  return 'IMAGE';
}

/**
 * Shared by every uploader in the app (course/module thumbnails,
 * flashcard media) — gets a presigned S3 PUT URL, uploads the file directly
 * to storage, and returns the CloudFront URL to store. Never sends the file
 * itself through GraphQL. Callers are responsible for their own accepted-
 * type validation before calling this (a course thumbnail and a flashcard's
 * media accept different sets), and the backend also revalidates content
 * type/extension regardless.
 */
export async function uploadMedia(file: File): Promise<string> {
  const { getCourseMediaUploadUrl: media } = await GraphQLClient.execute<GetCourseMediaUploadUrlMutation>(
    getCourseMediaUploadUrl,
    { fileName: file.name, contentType: file.type } satisfies GetCourseMediaUploadUrlMutationVariables
  );
  const putResponse = await fetch(media.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });
  if (!putResponse.ok) throw new Error('Upload to storage failed. Please try again.');
  return media.fileUrl;
}
