<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
              <textarea
                  class="form-control"
                  placeholder="Write a comment..."
                  rows="3"
              ></textarea>
      </div>
      <div class="card-footer">
        <img
            :src="user.image"
            class="comment-author-img"
        />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div
        class="card"
        v-for="comment in comments"
        :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">
          With supporting text below as a natural lead-in to additional
          content.
        </p>
      </div>
      <div class="card-footer">
        <a href="" class="comment-author">
          <img
              src="http://i.imgur.com/Qr71crq.jpg"
              class="comment-author-img"
          />
        </a>
        &nbsp;
        <a href="" class="comment-author">Jacob Schmidt</a>
        <span class="date-posted">Dec 29th</span>
        <span class="mod-options">
                <i class="ion-edit"></i>
                <i class="ion-trash-a"></i>
              </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticleComments } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: "articleMeta",
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      comments: [],
    }
  },
  computed: {
    ...mapState(['user'])
  },
  async mounted() {
    const { data } = await getArticleComments(this.article.slug)
    this.comments = data.comments
  }
};
</script>

<style>
</style>