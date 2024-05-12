import React, { useState } from "react";

import styles from "../../styles/recipe.module.css";

type Props = {
  comment: any;
  deleteComment: (e: any, id: any) => void;
};

const CommentCard: React.FC<Props> = (props) => {
  const { comment, deleteComment } = props;

  function timeSince(date) {
    var seconds = Math.floor(
      (new Date().valueOf() - new Date(date).valueOf()) / 1000
    );

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  return (
    <div className={styles.comment}>
      <p>{comment.message}</p>
      <div>
        {timeSince(comment.createdAt)} ago |{" "}
        <button
          className={styles.commentDelete}
          type="button"
          onClick={(e) => deleteComment(e, comment.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CommentCard;
