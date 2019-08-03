# Shopify Early
### Add to cart right on time
It was a quick, 30 minute code I decided to create so that the 100T fam could have an easier time to buy some apparel. But I realize that this has potential through just static code, no server really required. I decided to challenge myself, slowly build an app that runs on GitHub pages, something that creates processes and cop items without hassle.

For now, I'm just doing quick add to cart links, but from time to time, it'll evolve into something bigger.

### How to use it
In order to search through a Shopify site of your choice, you just need to add a domain to the `target` query parameter

##### Examples
- `https://early.satan.gg/?target=shop.100thieves.com`
- `https://early.satan.gg/?target=yeezysupply.com`

Once you're in the Shopify site you want. Just refresh every few seconds when you're expecting the release. Remember that this is data loaded directly from Shopify, so what you see is the same as what you see on their site. I made sure to only hide what isn't available. Best of luck!


##### Have multiple products you want to get at once? Combine them using commas!
Remember that the number behind each colon is the quantity count. For now, copy and pasting is the only way to do this. *See TODO*
- `https://shop.100thieves.com/cart/19661232870713:1,19681532872714:1`

### TODO:
- Prefill name, address, and email at checkout
- Select multiple items at once to check out *(these add to carts links don't necessarily mean they're in your cart, so I wanna be sure I can create a better one-stop shop for people)*.
- Better responsive design, simple UI/UX fixes *(Yeezy Supply is a perfect example of people unable to see all sizes in portrait mode due to more than 15 sizes being available at once, the only way to see the rest of the sizes is by rotating your phone into landscape, sorry about that, I'll be thinking of a good practical design to make sure you can see all sizes, or let you create preferences)*.
- Ability to bot
- Local storage for prefill/settings *(If I'm gonna try to give people the ability to bot, I might as well find efficient ways for people to save/load settings. Man, I must be crazy for attempting all of this through a JS file)*.
