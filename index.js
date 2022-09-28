addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// GraphQL query for Github API (https://developer.github.com/v4/)
const query = `
  query {
    mui: repository(owner: "mui", name: "material-ui") {
      url
      stargazers {
        totalCount
      }
    }
    antd: repository(owner: "ant-design", name: "ant-design") {
      url
      stargazers {
        totalCount
      }
    }
  }
`

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 4ac0e48c50dd3d7f67467323e6c68c4400d50bbb',
      'User-Agent': 'worker',
    },
    body: JSON.stringify({
      query,
    }),
  });
  const { data } = await res.json()
  console.log(data);
  const { mui, antd } = data;
  const diff = antd.stargazers.totalCount - mui.stargazers.totalCount;
  let text = '';
  if (diff > 0) {
    text = `🥰 YES, antd star 数超过 material-ui ${diff} 个`
  } else {
    text = `😞 No, antd star 还差 material-ui ${-diff} 个`
  }
  return new Response(`${text}\n\n${antd.stargazers.totalCount} vs ${mui.stargazers.totalCount}`)
}
