import DefaultTheme from 'vitepress/theme'
import './style.css'
import Layout from './Layout.vue'
import NewsHome from './components/NewsHome.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('NewsHome', NewsHome)
  },
}
