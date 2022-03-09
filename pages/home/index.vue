<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                    class="nav-link"
                    :class="{
                  active: tab === 'your_feed'
                    }"
                    exact
                    :to="{
                  name: 'home',
                  query: {
                    tab: 'your_feed'
                  }
                }">Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                    class="nav-link"
                    :class="{
                  active: tab === 'global_feed'
                    }"
                    exact
                    :to="{
                  name: 'home',
                  query: {
                    tab: 'global_feed'
                  }
                }">Global Feed</nuxt-link>
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                    class="nav-link"
                    :class="{
                  active: tab === 'tag'
                    }"
                    exact
                    :to="{
                  name: 'home',
                  query: {
                    tab: 'tag'
                  }
                }">#{{ tag }}</nuxt-link>
              </li>
            </ul>
          </div>

          <div
              v-for="article in articles"
              :key="article.slug"
              class="article-preview">
            <div class="article-meta">
              <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                <img :src="article.author.image"/>
              </nuxt-link>
              <div class="author">
                <nuxt-link :to="{
                name: 'profile',
                params: {
                  username: article.author.username
                }
              }">
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{ active: article.favorited }"
                  @click="onFavorite(article)"
                  :disabled="article.favoriteDisableted"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }" class="preview-link">
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                  class="page-item"
                  :class="{
                    active: item === page
                  }"
                  v-for="item in totalPage"
                  :key="item"
              >
                <nuxt-link
                    class="page-link"
                    :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: tab
                    }
                  }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                  :to="{
                  name: 'home',
                  query: {
                    tag: item,
                    tab: 'tag'
                  }
                  }"
                  class="tag-pill tag-default"
                  v-for="item in tags"
                  :key="item"
              >{{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getArticles, getFeedArticles, addFavorite, delFavorite } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";

export default {
  name: 'HomeIndex',
  async asyncData({ query, store }) {
    const limit = 20;
    const page = Number.parseInt(query.page || 1);
    const { tag } = query;
    const loadArticles = store.state.user && query.tab === 'your_feed' ? getFeedArticles : getArticles

    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: limit * (page - 1),
        tag: query.tag
      }),
      getTags()
    ]);

    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;

    articles.forEach(article => article.favoriteDisableted = false)
    tags.length = 10; // 假数据过多
    return {
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab: query.tab || 'global_feed'
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {
    totalPage () {
      return Math.ceil(this.articlesCount / this.limit)
    },
    ...mapState(['user'])
  },
  watch: {},
  created() {
  },
  mounted() {
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisableted = true;
      if(article.favorited) {
        await delFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisableted = false;
    }
  }
}
</script>

<style scoped></style>
