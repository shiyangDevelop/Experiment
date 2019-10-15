<template>
<div class="list">
  <header>这里是列表页</header>
  <p>{{$route.query.name}}</p>
</div>
</template>
<script>
export default {
  name: 'list'
}
</script>