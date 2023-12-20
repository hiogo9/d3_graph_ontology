<template lang="pug">
  .card.widget-text
    .card-body.widget-text__body
      template(v-for='(v) in textTokensProcessed' :key='"word-processed-"+v.from' )
        template(v-if='v.isActioned' )
          widget-text-snippet(:token-range-from='v.from' :token-range-to='v.to') {{ v.words }}
        template(v-else)
          span(v-html='v.words' )
    .card-footer.widget-text__footer
      .row
        .col-4.d-flex.align-items-center
          input.form-control(type='text' placeholder='Поиск по тексту...' v-model='searchValue')
        .col-2.d-flex.align-items-center(v-if="searchValue.toString().trim().length > 0")
          | Найдено: {{ wordFound.length }}
        .col-6.d-flex.align-items-center(v-if='isWaitingRoomNotEmpty' )
          a.btn.btn-sm(href='javascript:void(0)' @click.prevent='commitWaitingRoom' :class='{\'btn-secondary\': !isWaitingRoomFilled, \'disabled\': !isWaitingRoomFilled, \'btn-dark\': isWaitingRoomFilled}') Сохранить связь
          a.btn.btn-sm.btn-warning(href='javascript:void(0)' @click.prevent='tmpSetWaitingRoom') Заполнить вторую связь
        .col-6.d-flex.align-items-center(v-if='selectedText.length > 0')
          a.btn.btn-sm.btn-warning(href='javascript:void(0)' @click.prevent='moveSelectionToSearch' data-move-selection-to-search='Y') Искать выделенное

</template>

<script type="text/javascript">
import WidgetTextSnippet from './WidgetTextSnippet.vue'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'WidgetText',
  components: {
    WidgetTextSnippet
  },
  data() {
    return {
      originalText: null,
      searchValue: '',

      textTokens: null,
      selectedText: ''
    }
  },
  mounted() {
    this.originalText = __app?.test?.text
    let aTokens = [
      ...this.originalText.matchAll(
        /((<.*?>)|[a-zA-ZА-Яа-я\-]+|[\s]+|[^a-zA-ZА-Яа-я\-])/g
      )
    ]
    this.textTokens = []
    aTokens.forEach((v) => {
      this.textTokens.push({
        word: v[0],
        isTag: /^(<.*?>)$/.test(v[0].toString().trim().toLowerCase())
      })
    })

    document.addEventListener('mousedown', (e) => {
      setTimeout(() => {
        this.checkSeletion(e)
      }, 10)
    })
    document.addEventListener('mouseup', (e) => {
      setTimeout(() => {
        this.checkSeletion(e)
      }, 15)
    })
  },
  methods: {
    commitWaitingRoom() {
      this.$store.dispatch('tokens/commitWaitingRoom')
    },
    tmpSetWaitingRoom() {
      this.$store.commit('tokens/addToWaitingRoom', {
        type: 'graph',
        value: -1
      })
    },
    checkSeletion(e) {
      if (e.target.getAttribute('data-move-selection-to-search') != 'Y') {
        if (e.target.closest('.widget-text__body') !== null) {
          console.log(window.getSelection().toString().trim())
          this.selectedText = window.getSelection().toString().trim()
        } else {
          this.selectedText = ''
        }
      }
    },
    moveSelectionToSearch() {
      console.log('searched ' + this.selectedText)
      this.searchValue = this.selectedText
      this.selectedText = ''
      window.getSelection().empty()
    }
  },
  computed: {
    ...mapState('tokens', ['wordFound', 'waitingRoom']),
    ...mapGetters('tokens', [
      'isWordActioned',
      'isWaitingRoomNotEmpty',
      'isWaitingRoomFilled'
    ]),
    textTokensProcessed() {
      let tokens = [],
        lastTokenIsActioned = null,
        lastTokenWords = [],
        lastTokenRangeFrom = null

      if (this.textTokens !== null) {
        this.textTokens.forEach((v, k) => {
          let tmp = this.isWordActioned({ from: k, to: k })
          if (tmp !== lastTokenIsActioned) {
            if (lastTokenIsActioned !== null) {
              tokens.push({
                words: lastTokenWords.join(''),
                from: lastTokenRangeFrom,
                to: k - 1,
                isActioned: lastTokenIsActioned
              })
            }
            lastTokenIsActioned = tmp
            lastTokenWords = []
            lastTokenRangeFrom = k
          }
          lastTokenWords.push(v.word)
        })

        if (lastTokenWords.length > 0) {
          tokens.push({
            words: lastTokenWords.join(''),
            from: lastTokenRangeFrom,
            to: this.textTokens.length - 1,
            isActioned: lastTokenIsActioned
          })
        }
      }

      return tokens
    }
  },
  watch: {
    searchValue(v) {
      let foundTokens = [],
        searchTokens = [],
        tmpMatches = [
          ...v
            .toString()
            .trim()
            .toLocaleLowerCase()
            .matchAll(/((<.*?>)|[a-zA-ZА-Яа-я\-]+|[\s]+|[^a-zA-ZА-Яа-я\-])/g)
        ]

      tmpMatches.forEach((t) => {
        searchTokens.push(t[0])
      })
      tmpMatches = void 0

      if (searchTokens.length > 0) {
        /**
         * Начинам перебор слов, пытаясь найти
         *  вхождения по поиску
         */
        let from = null,
          to = null,
          iSearchTokenKeyCompare = 0

        this.textTokens.forEach((word, k) => {
          if (
            word.word
              .toLocaleLowerCase()
              .indexOf(searchTokens[iSearchTokenKeyCompare]) === 0 &&
            !word.isTag &&
            !this.$store.getters['tokens/isWordInRelation']({ from: k, to: k })
          ) {
            if (iSearchTokenKeyCompare === 0) {
              from = k
            }
            if (iSearchTokenKeyCompare === searchTokens.length - 1) {
              to = k
            }
            ++iSearchTokenKeyCompare
          } else {
            iSearchTokenKeyCompare = 0
            from = null
          }

          if (from !== null && to !== null) {
            foundTokens.push({
              from: from,
              to: to
            })
            iSearchTokenKeyCompare = 0
            from = null
            to = null
          }
        })
      }

      this.$store.commit('tokens/setWordFound', foundTokens)
    }
  }
}
</script>
