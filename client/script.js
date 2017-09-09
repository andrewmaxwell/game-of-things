/* global Vue */
'use strict';

/*

Add "Leave" button
Admin buttons: remove player, reset, refresh

*/

const ws = new WebSocket('ws://' + location.host.split(':')[0] + ':8000');
const send = data =>
  console.log('sending', data) || ws.send(JSON.stringify(data));
ws.addEventListener('open', () => {
  send({action: 'requestState'});
});
ws.addEventListener('message', ({data}) => {
  data = JSON.parse(data);
  console.log('received', data);
  if (actions[data.action]) actions[data.action](data);
  else console.error('Invalid action', data);
});

const actions = {
  requestState() {
    if (app.players.length) {
      send({
        action: 'setState',
        players: app.players,
        currentIndex: app.currentIndex
      });
    }
  },
  setState({players, currentIndex}) {
    if (!app.players.length) {
      app.players = players;
      app.currentIndex = currentIndex;
      if (players.some(p => p.username === app.username)) {
        app.joined = true;
      }
    }
  },
  join({username}) {
    app.players.push({username, answer: '', guessed: false, score: 0});
    if (username === app.username) app.joined = true;
  },
  answer({username, answer}) {
    const player = app.players.find(p => p.username === username);
    if (player) {
      player.answer = answer;
    } else {
      console.error('Invalid player', username, answer);
    }
  },
  guess({username, answer}) {
    const player = app.players.find(
      p => p.username === username && p.answer === answer
    );
    if (player) {
      player.guessed = true;
      app.players[app.currentIndex].score++;
      if (app.players.every(p => p.guessed)) {
        app.answer = '';
        app.players.forEach(p => {
          p.answer = '';
          p.guessed = false;
        });
      }
    } else {
      const activePlayers = app.players.filter(p => !p.guessed);
      const activeIndex = activePlayers.indexOf(app.players[app.currentIndex]);
      const nextPlayer =
        activePlayers[(activeIndex + 1) % activePlayers.length];
      app.currentIndex = app.players.indexOf(nextPlayer);
    }
  }
};

const app = new Vue({
  el: '#app',
  data: {
    username: location.search.substring(1) || localStorage.username || '',
    answer: '',
    joined: false,
    players: [],
    currentIndex: 0
  },
  methods: {
    join() {
      localStorage.username = this.username;
      send({action: 'join', username: this.username});
    },
    submitAnswer() {
      send({action: 'answer', username: this.username, answer: this.answer});
    },
    guess(answer, username) {
      if (this.username === this.players[this.currentIndex].username) {
        send({action: 'guess', username, answer});
      }
    }
  },
  computed: {
    validUsername() {
      return (
        this.username && this.players.every(p => p.username !== this.username)
      );
    },
    allHaveAnswered() {
      return this.players.length > 2 && this.players.every(p => p.answer);
    },
    haveAnswered() {
      return this.players.some(p => p.username === this.username && p.answer);
    }
  },
  template: `
    <div>
      <p>Other players: {{ players.map(p => p.username).join(', ') || 'No one, yet!' }}</p>

      <form @submit.prevent="join" v-if="!joined">
        <label>
          Enter your name.
          <input type="text" v-model="username"/>
        </label>
        <button :disabled="!validUsername">Join</button>
      </form>

      <form @submit.prevent="submitAnswer" v-if="joined && !allHaveAnswered">
        <label>
          Enter your answer.
          <input type="text" v-model="answer"/>
        </label>
        <button :disabled="!answer">{{ haveAnswered ? 'Change Answer' : 'Submit' }}</button>
        <p>Waiting for: {{ players.filter(p => !p.answer).map(p => p.username).join(', ') || 'More players...' }}</p>
      </form>

      <div v-if="joined && allHaveAnswered">
        <p>It's {{ this.players[this.currentIndex].username }}'s turn.</p>
        <div v-for="a in players" style="margin-bottom: 20px">
          <div>
            {{ a.answer }}
            <span v-if="a.guessed">- {{ a.username}}</span>
          </div>
          <button
            v-for="p in players"
            :disabled="a.guessed || p.guessed"
            @click="guess(a.answer, p.username)"
          >
            {{ p.username }}
          </button>
        </div>
      </div>

    </div>
  `
});

// actions.join({username: 'Bob'});
// actions.join({username: 'Bill'});
// actions.answer({username: 'Bob', answer: 'your mom'});
// actions.answer({username: 'Bill', answer: 'your face'});
