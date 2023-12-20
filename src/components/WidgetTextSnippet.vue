<template lang="pug">
  span.widget-text__snippet
    template(v-if='isWordInRelation({from: tokenRangeFrom, to: tokenRangeTo})' )
      a.widget-text__word.widget-text__word-relation(href='javascript:void(0)' @click.prevent='showDropdown')
        slot
      .dropdown-menu(:class='{"d-block": isDropdownShow}')
        a.dropdown-item(href='javascript:void(0)' @click.prevent='removeRelation(relationKey)' v-for='relationKey in getRelationsKeyListByWordToken({from: tokenRangeFrom, to: tokenRangeTo})' :key='"relation-"+relationKey') Удалить связь {{ '#'+relationKey }}
        a.dropdown-item(href='javascript:void(0)' @click.prevent='addToWaitingRoom') Добавить связь
    template(v-else-if='isWordInWaitingRoom({from: tokenRangeFrom, to: tokenRangeTo})' )
      a.widget-text__word.widget-text__word-waiting-room(href='javascript:void(0)' @click.prevent='showDropdown')
        slot
      .dropdown-menu(:class='{"d-block": isDropdownShow}')
        a.dropdown-item(href='javascript:void(0)' @click.prevent='deleteFromWaitingRoom') Отвязать
    template(v-else-if='isWordFound({from: tokenRangeFrom, to: tokenRangeTo})' )
      a.widget-text__word.widget-text__word-found(href='javascript:void(0)' @click.prevent='showDropdown')
        slot
      .dropdown-menu(:class='{"d-block": isDropdownShow}')
        a.dropdown-item(href='javascript:void(0)' @click.prevent='addToWaitingRoom') Связать
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'WidgetTextSnippet',
  props: {
    tokenRangeFrom: {
      type: Number
    },
    tokenRangeTo: {
      type: Number
    }
  },
  data() {
    return {
      isDropdownShow: false
    }
  },
  methods: {
    showDropdown() {
      this.isDropdownShow = true
      window.addEventListener('click', (ee) => {
        if (ee.target.closest('.widget-text__snippet') === null) {
          this.isDropdownShow = false
        }
      })
    },
    addToWaitingRoom() {
      this.$store.commit('tokens/addToWaitingRoom', {
        type: 'word',
        value: {
          from: this.tokenRangeFrom,
          to: this.tokenRangeTo
        }
      })
    },
    deleteFromWaitingRoom() {
      this.$store.commit('tokens/deleteFromWaitingRoom', {
        type: 'word'
      })
    },
    removeRelation(relationKey) {
      this.$store.commit('tokens/removeRelation', {
        relationKey: relationKey
      })
    }
  },
  computed: {
    ...mapGetters('tokens', [
      'isWordFound',
      'isWordInWaitingRoom',
      'isWordInRelation',
      'getRelationsKeyListByWordToken'
    ])
  }
}
</script>
