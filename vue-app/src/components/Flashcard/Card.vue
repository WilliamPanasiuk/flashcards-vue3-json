<template>
  <div>
    <div class="card card--front" v-if="isFrontVisible" @click="showAnswer">
      <div class="card-header card__header">
        <div class="card-header-title card__header-title">
          <div class="field is-grouped">
            <div class="control">
              <div class="tags has-addons">
                <button
                  class="button is-primary is-small"
                  @click.stop="onEditClick"
                >
                  edit
                </button>
              </div>
            </div>
          </div>
          <div class="field has-addons has-addons-centered">
            <div class="control" style="margin-right: 10px">
              <div class="tags has-addons">
                <span class="tag is-dark">tries</span>
                <span class="tag is-light">
                  {{ card.no_repetition }}
                </span>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-danger">
                  {{ card.no_repetition_wrong }}
                </span>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-info">
                  {{ card.no_repetition_average }}
                </span>
              </div>
            </div>
            <div class="control">
              <div class="tags has-addons">
                <span class="tag is-success">
                  {{ card.no_repetition_good }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content card__content">
        <p class="title">
          {{ card.front }}
        </p>
        <div>
          <button
            class="button is-primary"
            :disabled="isBackVisible ? true : false"
          >
            Answer
          </button>
        </div>
      </div>
    </div>
    <div class="card card--back" v-if="isBackVisible">
      <div class="card-content card__content">
        <p class="title">
          {{ card.back }}
        </p>
        <Marks
          @callMark="callMark"
          :isRemebered="actFlashCard.ok_in_row == 4 ? true : false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import Marks from "@/components/Flashcard/Marks.vue";
export default {
  name: "Card",
  props: {
    card: {
      type: Object,
      required: false,
    },
  },
  components: {
    Marks,
  },
  setup(props, context) {
    let isFrontVisible = ref(true);
    let isBackVisible = ref(false);
    const day_1 = 3;
    const day_2 = 7;
    const day_3 = 14;
    const day_4 = 28;

    const actFlashCard = computed(() => {
      return props.card;
    });

    const showAnswer = () => {
      isBackVisible.value = true;
    };

    const callMark = (mark) => {
      let date = new Date();
      date.setHours(0, 0, 0, 0);
      actFlashCard.value.no_repetition++;      

      if (mark == "n") {
        actFlashCard.value.no_repetition_wrong++;
        actFlashCard.value.ok_in_row = 0;
        actFlashCard.value.repeat_date = addDays(date, 0);
      } else if (mark == "o") {
        if (actFlashCard.value.ok_in_row == 4) {
          actFlashCard.value.is_remembered = true;
        } else if (actFlashCard.value.ok_in_row == 3) {
          actFlashCard.value.repeat_date = addDays(date, day_4);
        } else if (actFlashCard.value.ok_in_row == 2) {
          actFlashCard.value.repeat_date = addDays(date, day_3);
        } else if (actFlashCard.value.ok_in_row == 1) {
          actFlashCard.value.repeat_date = addDays(date, day_2);
        } else {
          actFlashCard.value.repeat_date = addDays(date, day_1);
        }
        actFlashCard.value.no_repetition_good++;
        actFlashCard.value.ok_in_row++;
      } else if (mark == "a") {
      }
      isBackVisible.value = false;
      context.emit("doneAnswerEvent", actFlashCard.value);
      
    };

    const addDays = (date, days) => {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const router = useRouter();
    const route = useRoute();

    const onEditClick = () => {
      router.push({
        path: "/flashcards",
        query: { id: actFlashCard.value.id },
      });
    };

    return {
      isFrontVisible,
      isBackVisible,
      actFlashCard,
      showAnswer,
      callMark,
      addDays,
      onEditClick,
    };
  },
};
</script>