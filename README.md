# Shopify Early
### Add to cart right on time
It was a quick, 30 minute code I decided to create so that the 100T fam could have an easier time to buy some apparel. But I realize that this has potential through just static code, no server really required. I decided to challenge myself, slow build an app that runs on GitHub pages, something that creates processes and cop items without hassle.

For now, I'm just doing quick add to cart links, but from time to time, it'll evolve into something bigger.

### How to use it
In order to search through a Shopify site of your choice, you just need to add a domain to the `target` query parameter

##### Examples
- `https://early.satan.gg/?target=shop.100thieves.com`
- `https://early.satan.gg/?target=yeezysupply.com`

Once you're in the Shopify site you want. Just refresh every few seconds when you're expecting the release. Remember that this is data loaded directly from Shopify, so what you see is the same as what you see on their site. I made sure to only hide what isn't available. Best of luck!

### TODO:
- Prefill name, address, and email at checkout
- Select multiple items at once to check out (these add to carts links don't necessarily mean they're in your cart, so I wanna be sure I can create a better one-stop shop for people).
- Better responsive design
