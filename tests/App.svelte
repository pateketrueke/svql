<script>
  import { Router, Route } from 'svero';
  import { Pokemon } from './pages/pokemon';
</script>

<Router>
  <Route exact path="/">
    <h1>It works!</h1>
  </Route>
  <Route path="/:name" component={Pokemon} />
</Router>
