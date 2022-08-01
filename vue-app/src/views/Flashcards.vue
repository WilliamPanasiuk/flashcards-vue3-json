<template>
  <div class="flashcards container">
    <div class="box block">
      <p class="label">Add flashcard</p>
      <form class="field is-horizontal add-flashcard">
        <div class="field-body">
          <div class="field">
            <input
              type="text"
              placeholder="front"
              v-model="newFront"
              @keyup.enter="isPossibleAdd ? { click: addCard() } : {}"
              class="input is-primary is-extended"
            />
          </div>
          <div class="field">
            <input
              type="text"
              placeholder="back"
              v-model="newBack"
              @keyup.enter="isPossibleAdd ? { click: addCard() } : {}"
              class="input is-primary"
            />
          </div>
          <div class="field is-narrow">
            <button
              type="button"
              v-on="isPossibleAdd ? { click: addCard } : {}"
              class="button is-primary"
              :class="{ idle: !isPossibleAdd }"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
    <div class="box block" v-if="flashcardsNotRemebered.length">
      <p class="label">To learn</p>
      <table class="table is-hoverable table-flashcards table is-fullwidth">
        <thead>
          <tr>
            <th></th>
            <th>front</th>
            <th>back</th>
            <th>marks</th>
            <th>tries</th>
            <th>ok in row</th>
            <th>repat</th>
            <th></th>
          </tr>
        </thead>
        <TransitionGroup name="list" tag="tbody">
          <tr v-for="(card, i) in flashcardsNotRemebered" :key="card.id">
            <td class="table-flashcards__id">{{ i + 1 }}</td>
            <td class="table-flashcards__input">
              <input
                v-model="card.front"
                type="text"
                class="input is-primary is-small"
                @keyup.enter="editCard(card.id)"
              />
            </td>
            <td class="table-flashcards__input">
              <input
                v-model="card.back"
                type="text"
                class="input is-primary is-small"
                @keyup.enter="editCard(card.id)"
              />
            </td>
            <td class="table-flashcards__marks">
              <span class="tag is-danger">
                {{ card.no_repetition_wrong }}
              </span>
              <span class="tag is-info">
                {{ card.no_repetition_average }}
              </span>
              <span class="tag is-success">
                {{ card.no_repetition_good }}
              </span>
            </td>
            <td>
              <span class="tag is-light">
                {{ card.no_repetition }}
              </span>
            </td>
            <td class="has-text-centered">
              <span class="tag is-success">
                {{ card.ok_in_row }}
              </span>
            </td>
            <td>
              {{ showDate(card.repeat_date) }}
            </td>
            <td class="table-flashcards__ui">
              <button
                @click.stop="editCard(card.id)"
                class="button is-small is-info mr-1"
              >
                <font-awesome-icon :icon="['fas', 'floppy-disk']" />
              </button>
              <button
                @click.stop="deleteCard(card.id)"
                class="button is-small is-danger"
              >
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </button>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>

    <div class="box block" v-if="flashcardRemebered.length">
      <p class="label">Learnt</p>

      <table class="table is-hoverable table-flashcards table is-fullwidth">
        <thead>
          <tr>
            <th></th>
            <th>front</th>
            <th>back</th>
            <th>marks</th>
            <th>tries</th>
            <th></th>
          </tr>
        </thead>
        <TransitionGroup name="list-rememered" tag="tbody">
          <tr v-for="(card, i) in flashcardRemebered" :key="card.id">
            <td class="table-flashcards__id">{{ i + 1 }}</td>
            <td class="table-flashcards__input">
              <input
                v-model="card.front"
                type="text"
                class="input is-primary is-small"
                @keyup.enter="editCard(card.id)"
              />
            </td>
            <td class="table-flashcards__input">
              <input
                v-model="card.back"
                type="text"
                class="input is-primary is-small"
                @keyup.enter="editCard(card.id)"
              />
            </td>
            <td class="table-flashcards__marks">
              <span class="tag is-danger">
                {{ card.no_repetition_wrong }}
              </span>
              <span class="tag is-info">
                {{ card.no_repetition_average }}
              </span>
              <span class="tag is-success">
                {{ card.no_repetition_good }}
              </span>
            </td>
            <td>
              <span class="tag is-light">
                {{ card.no_repetition }}
              </span>
            </td>

            <td class="table-flashcards__ui">
              <button
                @click.stop="resetProgress(card.id)"
                class="button is-small is-info mr-1"
              >
                reset
              </button>
              <button
                @click.stop="editCard(card.id)"
                class="button is-small is-info mr-1"
              >
                <font-awesome-icon :icon="['fas', 'floppy-disk']" />
              </button>
              <button
                @click.stop="deleteCard(card.id)"
                class="button is-small is-danger"
              >
                <font-awesome-icon :icon="['fas', 'trash-can']" />
              </button>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>
  </div>
</template>

<script >
import { ref, computed } from "vue";
export default {
  name: "Flashcards",
  setup() {
    let flashcards = ref([]);
    let actCardIndex = ref(null); 
    let actCard = ref({});
    let lastCard = ref(0);
    const error = ref(null);

    const loadFlashcards = async () => {
      try {
        let response = await fetch(process.env.VUE_APP_API_PATH);
        if (response.ok) {
          const data = await response.json();
          flashcards.value = await data;
          lastCard.value = await flashcards.value[flashcards.value.length - 1];
        } else {
          throw Error("--> error");
        }
      } catch (err) {
        console.log(
          "🚀 ~ file: Flashcards.vue ~ line 54 ~ loadFlashcards ~ err",
          err
        );
        error.value = err.message;
      }
    };

    loadFlashcards();

    const front = ref(null);
    const back = ref(null);
    const newFront = ref(null);
    const newBack = ref(null);    

    const addCard = async () => {
      const front = newFront.value;
      const back = newBack.value;

      let newId;
      if (flashcards.value.length) {
        newId = lastCard.value.id + 1;
      } else {
        newId = 0;
      }

      let date = new Date();
      date.setHours(0, 0, 0, 0);
      let repeat_date = date;

      const addCardRequest = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newId,
          front: front,
          back: back,
          created_at: date,
          updated_at: "",
          no_repetition: 0,
          ok_in_row: 0,
          no_repetition_wrong: 0,
          no_repetition_average: 0,
          no_repetition_good: 0,
          repeat_date: repeat_date,
          is_remembered: false,
        }),
      };

      await fetch(process.env.VUE_APP_API_PATH, addCardRequest);
      actCardIndex.value = null;
      loadFlashcards();

      newFront.value = "";
      newBack.value = "";
    };

    const editCard = async (id) => {
      const card = flashcards.value.find(function (element) {
        return element.id == id;
      });

      const editCardRequest = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          front: card.front,
          back: card.back,
          updated_at: new Date(),
        }),
      };

      await fetch(
        process.env.VUE_APP_API_PATH + "/" + card.id,
        editCardRequest
      );
      loadFlashcards();
    };

    const deleteCard = async (id) => {
      const card = flashcards.value.find(function (element) {
        return element.id == id;
      });
      const deleteCardRequest = {
        method: "DELETE",
      };

      await fetch(
        process.env.VUE_APP_API_PATH + "/" + card.id,
        deleteCardRequest
      );
      loadFlashcards();
    };

    const addDaysToDate = (date, days) => {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const showDate = (date) => {
      let d = new Date(date);
      return d.getFullYear() + "." + (d.getMonth() + 1) + "." + d.getDate();
    };

    const isPossibleAdd = computed(() => {
      return newFront.value && newBack.value;
    });

    const flashcardsNotRemebered = computed(() => {
      return flashcards.value.filter((card) => card.is_remembered === false);
    });

    const flashcardRemebered = computed(() => {
      return flashcards.value.filter((card) => card.is_remembered === true);
    });

    const resetProgress = async (id) => {
      const card = flashcards.value.find(function (element) {
        return element.id == id;
      });
      card.ok_in_row = 0;

      const editCardRequest = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          front: card.front,
          back: card.back,
          updated_at: new Date(),
          ok_in_row: 0,
          is_remembered: false,
        }),
      };

      await fetch(
        process.env.VUE_APP_API_PATH + "/" + card.id,
        editCardRequest
      );
      loadFlashcards();
    };

    return {
      actCard,
      actCardIndex,
      lastCard,
      flashcards,
      front,
      back,
      newFront,
      newBack,
      addCard,
      editCard,
      error,
      deleteCard,
      showDate,
      isPossibleAdd,
      flashcardsNotRemebered,
      flashcardRemebered,
      resetProgress,
    };
  },
};
</script>

