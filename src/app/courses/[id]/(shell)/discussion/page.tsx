'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MessageSquare, Loader2, Trash2, Send, CornerDownRight } from 'lucide-react';
import { GraphQLClient } from '@/lib/graphql-client';
import { useAuth, displayName } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { discussionForCourse } from '@/graphql/queries';
import { createDiscussionPost, deleteDiscussionPost } from '@/graphql/mutations';
import type {
  DiscussionForCourseQuery, DiscussionForCourseQueryVariables,
  CreateDiscussionPostMutation, CreateDiscussionPostMutationVariables,
  DeleteDiscussionPostMutation, DeleteDiscussionPostMutationVariables,
  DiscussionPost,
} from '@/API';
import Avatar from '@/components/Avatar';
import ComingSoonTab from '@/components/course/ComingSoonTab';

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

function PostRow({
  post, isMine, onDelete, indent,
}: {
  post: DiscussionPost;
  isMine: boolean;
  onDelete: (id: string) => Promise<void>;
  indent?: boolean;
}) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div className={`flex gap-3 ${indent ? 'pl-10' : ''}`}>
      <Avatar name={post.authorName} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-ink-900">{post.authorName}</span>
          <span className="text-xs text-ink-400">{timeAgo(post.createdAt)}</span>
        </div>
        <p className="text-sm text-ink-700 leading-relaxed whitespace-pre-line mt-0.5">{post.body}</p>
      </div>
      {isMine && (
        <button
          type="button"
          onClick={async () => {
            setDeleting(true);
            await onDelete(post.id);
            setDeleting(false);
          }}
          disabled={deleting}
          className="flex-shrink-0 text-ink-300 hover:text-red-600 transition-colors self-start p-1 disabled:opacity-50"
          aria-label="Delete post"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
}

export default function CourseDiscussionPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { user } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<DiscussionPost[]>([]);
  const [newBody, setNewBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [replying, setReplying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { discussionForCourse: fetched } = await GraphQLClient.execute<DiscussionForCourseQuery>(
        discussionForCourse,
        { courseId } satisfies DiscussionForCourseQueryVariables
      );
      setPosts(fetched);
    } catch (err) {
      console.error('[CourseDiscussionPage] load failed ->', err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handlePost() {
    if (!newBody.trim() || posting) return;
    setPosting(true);
    try {
      const { createDiscussionPost: created } = await GraphQLClient.execute<CreateDiscussionPostMutation>(
        createDiscussionPost,
        { courseId, input: { body: newBody.trim() } } satisfies CreateDiscussionPostMutationVariables
      );
      setPosts((prev) => [...prev, created]);
      setNewBody('');
    } catch (err) {
      console.error('[CourseDiscussionPage] post failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not post that.');
    } finally {
      setPosting(false);
    }
  }

  async function handleReply(parentPostId: string) {
    if (!replyBody.trim() || replying) return;
    setReplying(true);
    try {
      const { createDiscussionPost: created } = await GraphQLClient.execute<CreateDiscussionPostMutation>(
        createDiscussionPost,
        { courseId, input: { body: replyBody.trim(), parentPostId } } satisfies CreateDiscussionPostMutationVariables
      );
      setPosts((prev) => [...prev, created]);
      setReplyBody('');
      setReplyingTo(null);
    } catch (err) {
      console.error('[CourseDiscussionPage] reply failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not post that reply.');
    } finally {
      setReplying(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await GraphQLClient.execute<DeleteDiscussionPostMutation>(deleteDiscussionPost, {
        courseId,
        id,
      } satisfies DeleteDiscussionPostMutationVariables);
      setPosts((prev) => prev.filter((p) => p.id !== id && p.parentPostId !== id));
    } catch (err) {
      console.error('[CourseDiscussionPage] delete failed ->', err);
      toast.error(err instanceof Error ? err.message : 'Could not delete that post.');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 text-ink-400 animate-spin" />
      </div>
    );
  }

  const topLevel = posts.filter((p) => !p.parentPostId);
  const repliesFor = (id: string) => posts.filter((p) => p.parentPostId === id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="mb-8">
        <div className="flex gap-3">
          <Avatar name={user ? displayName(user) : 'You'} imageUrl={user?.avatarUrl ?? undefined} size="sm" />
          <div className="flex-1">
            <textarea
              rows={3}
              placeholder="Ask a question or start a discussion..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              disabled={posting}
              className="w-full rounded-lg border border-ink-200 px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handlePost}
                disabled={posting || !newBody.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {posting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {topLevel.length === 0 ? (
        <ComingSoonTab
          icon={MessageSquare}
          title="No discussion yet"
          description="Be the first to ask a question or share something about this course."
        />
      ) : (
        <div className="space-y-6">
          {topLevel.map((post) => (
            <div key={post.id} className="pb-6 border-b border-ink-100 last:border-b-0">
              <PostRow post={post} isMine={post.authorId === user?.id} onDelete={handleDelete} />
              <div className="mt-3 space-y-3">
                {repliesFor(post.id).map((reply) => (
                  <PostRow key={reply.id} post={reply} isMine={reply.authorId === user?.id} onDelete={handleDelete} indent />
                ))}
              </div>
              {replyingTo === post.id ? (
                <div className="pl-10 mt-3 flex gap-2">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Write a reply..."
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') void handleReply(post.id); }}
                    disabled={replying}
                    className="flex-1 rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => void handleReply(post.id)}
                    disabled={replying || !replyBody.trim()}
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {replying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Reply'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setReplyingTo(null); setReplyBody(''); }}
                    className="text-xs font-semibold text-ink-400 hover:text-ink-600 px-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setReplyingTo(post.id)}
                  className="pl-10 mt-3 inline-flex items-center gap-1 text-xs font-bold text-ink-500 hover:text-indigo-600 transition-colors"
                >
                  <CornerDownRight className="w-3.5 h-3.5" /> Reply
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
