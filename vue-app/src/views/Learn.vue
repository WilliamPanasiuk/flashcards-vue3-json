<template>
  <div class="learn container">
    <div class="box block">
      Repetitions for today <b>{{ flashcardsForToday.length }}</b>
    </div>
    <div v-if="flashcardsForToday.length">
      <Card
        :card="actCard"
        :key="actCard.id"
        @doneAnswerEvent="doneAnswerEvent"
      ></Card>
    </div>
    <div v-else class="">
      <div class="notification is-warning">
        <p>No flashcards to revise for today</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import Card from "@/components/Flashcard/Card.vue";
export default {
  name: "Learning",
  components: {
    Card,
  },
  setup() {
    let flashcards = ref([]); 
    let actCardIndex = ref(null); 
    let actCard = ref({}); 
    const error = ref(null);

    const loadFlashcards = async () => {
      try {
        let data = await fetch(process.env.VUE_APP_API_PATH);
        if (data.ok) {
          flashcards.value = await data.json();
          flashcards.value = flashcards.value.filter(
            (flashcard) => flashcard.is_remembered === false
          );
          drawActCard();
        } else if (!data.ok) {
          throw Error("błąd");
        }
      } catch (err) {
        error.value = err.message;
      }
    };

    const flashcardsForToday = computed(() => {
      let todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0); 

      let cards = flashcards.value.filter((card) => {
        return new Date(card.repeat_date).getTime() <= todayDate.getTime();
      });
      return cards;
    });

    loadFlashcards();

    let randomCard = () => {
      const rand = Math.floor(Math.random() * flashcardsForToday.value.length);
      return rand;
    };

    const drawActCard = () => {
      actCardIndex.value = randomCard();
      actCard.value = flashcardsForToday.value[actCardIndex.value];
    };

    const doneAnswerEvent = async (card) => {
      await saveCard(card);
      drawActCard();
    };

    const saveCard = (actCard) => {
      const reresponse = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actCard),
      };

      fetch(process.env.VUE_APP_API_PATH + "/" + actCard.id, reresponse).then(
        (response) => response.json()
      );
    };

    return {
      flashcards,
      actCard,
      actCardIndex,
      error,
      randomCard,
      doneAnswerEvent,
      flashcardsForToday,
    };
  },
};
</script>

