var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/RyoNishiyama/svelte-scrolly-baseballer-height.git', // Update to point to your repository  
        user: {
            name: 'RN', // update to use your name
            email: 'nishiyama.ry@gmail.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)