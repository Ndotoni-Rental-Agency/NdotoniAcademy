'use client';

import { useCallback, useEffect, useState } from 'react';
import { MessageSquare, Loader2, Trash2 } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { useToast } from '@/lib/toast-context';
import { discussionForCourse } from '@/graphql/queries';
import { deleteDiscussionPost } from '@/graphql/mutations';
import type {
  DiscussionForCourseQuery, DiscussionForCourseQueryVariables,
  DeleteDiscussionPostMutation, DeleteDiscussionPostMutationVariables,
  DiscussionPost,
} from '@/API';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

/**
 * Read-only moderation view — same flat list the learner Discussion tab
 * builds, but delete-only (any post, not just the caller's own — the
 * backend's assertCanManage gate is what actually enforces that, this view
 * simply always shows the button since only a course manager can reach
 * Studio at all). Lets an instructor moderate without leaving the
 * authoring surface.
 */
export default function StudioDiscussionPane({ courseId }: { courseId: string }) {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { discussionForCourse: fetched } = await GraphQLClient.execute<DiscussionForCourseQuery>(
        discussionForCourse,
        { courseId } satisfies DiscussionForCourseQueryVariables
      );
      setPosts(fetched);
    } catch (err) {
      console.error('[StudioDiscussionPane] load failed ->', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await GraphQLClient.execute<DeleteDiscussionPostMutation>(deleteDiscussionPost, {
        courseId,
        id,
      } satisfies DeleteDiscussionPostMutationVariables);
      setPosts((prev) => prev.filter((p) => p.id !== id && p.parentPostId !== id));
      toast.success('Post removed.');
    } catch (err) {
      console.error('[StudioDiscussionPane] delete failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not remove that post.');
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-ink-400 animate-spin" />
      </div>
    );
  }

  const sorted = [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-6 lg:p-8">
      <h2 className="text-xl font-semibold text-ink-900 flex items-center gap-2 mb-1">
        <MessageSquare className="w-5 h-5 text-indigo-600 flex-shrink-0" /> Discussion
      </h2>
      <p className="text-sm text-ink-500 mb-6">
        Every post and reply on this course, newest first. Remove anything that needs moderating.
      </p>

      {sorted.length === 0 ? (
        <p className="text-sm text-ink-400">No posts yet.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((post) => (
            <div key={post.id} className="flex items-start gap-3 rounded-xl border border-ink-100 p-3.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-bold text-ink-900">{post.authorName}</span>
                  <span className="text-xs text-ink-400">{timeAgo(post.createdAt)}</span>
                  {post.parentPostId && (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-ink-400 bg-ink-100 px-1.5 py-0.5 rounded-full">Reply</span>
                  )}
                </div>
                <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line mt-0.5">{post.body}</p>
              </div>
              <button
                type="button"
                onClick={() => void handleDelete(post.id)}
                disabled={deletingId === post.id}
                className="flex-shrink-0 text-ink-300 hover:text-red-600 transition-colors p-1 disabled:opacity-50"
                aria-label="Delete post"
              >
                {deletingId === post.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
