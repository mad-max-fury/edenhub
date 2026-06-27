"use client";

import { useState } from "react";
import { getCookie } from "cookies-next";
import { ChevronUp, MessageSquare, Send } from "lucide-react";
import { Button, notify } from "@/components";
import { useAuthModal } from "@/components/authModal/AuthModal";
import {
  useGetProductQuestionsQuery,
  useCreateQuestionMutation,
  useAnswerQuestionMutation,
  useVoteQuestionMutation,
} from "@/redux/api/questions";
import { cookieValues } from "@/constants/data";
import { getApiErrorMessage } from "@/utils/helpers";

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
};

export const ProductQA = ({ productId }: { productId: string }) => {
  const { requireAuth } = useAuthModal();
  const isLoggedIn = !!getCookie(cookieValues.token);

  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetProductQuestionsQuery({
    productId,
    pageNumber: page,
    pageSize: 5,
  });
  const [createQuestion, { isLoading: creating }] = useCreateQuestionMutation();
  const [answerQuestion] = useAnswerQuestionMutation();
  const [voteQuestion] = useVoteQuestionMutation();

  const [questionText, setQuestionText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const questions = data?.data?.data ?? [];
  const metadata = data?.data?.metadata;

  const handleAsk = async () => {
    if (!questionText.trim()) return;
    const doAsk = async () => {
      try {
        await createQuestion({
          productId,
          question: questionText.trim(),
        }).unwrap();
        setQuestionText("");
      } catch (err) {
        notify.error({
          message: "Could not post question",
          subtitle: getApiErrorMessage(err),
        });
      }
    };
    if (!isLoggedIn) {
      requireAuth(doAsk);
      return;
    }
    doAsk();
  };

  const handleReply = async (questionId: string) => {
    if (!replyText.trim()) return;
    try {
      await answerQuestion({ id: questionId, body: replyText.trim() }).unwrap();
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      notify.error({
        message: "Could not post answer",
        subtitle: getApiErrorMessage(err),
      });
    }
  };

  const handleVote = (questionId: string) => {
    const doVote = () => voteQuestion(questionId);
    if (!isLoggedIn) {
      requireAuth(doVote);
      return;
    }
    doVote();
  };

  return (
    <section className="mt-12 border-t border-N20 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[15px] font-semibold text-N900">
          Questions & Answers
        </h2>
        <span className="text-xs text-N400">
          {metadata?.totalCount ?? 0} question
          {(metadata?.totalCount ?? 0) === 1 ? "" : "s"}
        </span>
      </div>

      {/* Ask a question */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Have a question about this product?"
          className="flex-1 h-10 px-3 text-sm border border-N30 rounded bg-white text-N800 placeholder:text-N300 focus:outline-none focus:border-N200"
        />
        <Button
          variant="brown"
          className="h-10 px-4 text-sm shrink-0"
          onClick={handleAsk}
          disabled={creating || !questionText.trim()}
        >
          Ask
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-N10 rounded animate-pulse" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="mx-auto text-N200 mb-2" size={28} />
          <p className="text-sm text-N400">
            No questions yet. Be the first to ask!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q) => (
            <div key={q._id} className="border border-N20 rounded-lg p-4">
              <div className="flex gap-3">
                {/* Vote */}
                <button
                  onClick={() => handleVote(q._id)}
                  className="flex flex-col items-center gap-0.5 pt-0.5 shrink-0"
                >
                  <ChevronUp
                    size={16}
                    className={
                      q.votedBy?.includes("")
                        ? "text-BR500"
                        : "text-N300 hover:text-N600"
                    }
                  />
                  <span className="text-xs font-medium text-N600">
                    {q.votes}
                  </span>
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-N800">{q.question}</p>
                  <p className="text-[11px] text-N400 mt-1">
                    {q.user?.firstName} {q.user?.lastName} &middot;{" "}
                    {timeAgo(q.createdAt)}
                  </p>

                  {/* Answers */}
                  {q.answers.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2.5">
                      {q.answers.map((a) => (
                        <div
                          key={a._id}
                          className="pl-3 border-l-2 border-N30"
                        >
                          <p className="text-sm text-N700">{a.body}</p>
                          <p className="text-[11px] text-N400 mt-0.5">
                            {a.isAdmin && (
                              <span className="text-BR500 font-medium mr-1">
                                Seller
                              </span>
                            )}
                            {a.user?.firstName} {a.user?.lastName} &middot;{" "}
                            {timeAgo(a.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply toggle */}
                  {isLoggedIn && (
                    <>
                      {replyingTo === q._id ? (
                        <div className="flex gap-2 mt-3">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleReply(q._id)
                            }
                            placeholder="Write an answer…"
                            className="flex-1 h-8 px-2.5 text-sm border border-N30 rounded bg-white text-N800 placeholder:text-N300 focus:outline-none focus:border-N200"
                            autoFocus
                          />
                          <button
                            onClick={() => handleReply(q._id)}
                            disabled={!replyText.trim()}
                            className="h-8 w-8 grid place-items-center text-BR500 hover:bg-BR50 rounded disabled:opacity-40"
                          >
                            <Send size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText("");
                            }}
                            className="text-xs text-N400 hover:text-N600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingTo(q._id)}
                          className="text-xs text-BR500 hover:underline mt-2"
                        >
                          Answer
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {metadata && metadata.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!metadata.hasPrevious}
                className="text-xs text-N500 hover:text-N800 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-N400">
                {metadata.currentPage} of {metadata.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!metadata.hasNext}
                className="text-xs text-N500 hover:text-N800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
