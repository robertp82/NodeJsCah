var baseCards = require('./baseCards');
var humCard = require('../humCard');

var HumQuestionCards = function() {
    baseCards.BaseCards.call(this);
    this.data = [
"%s + %s = %s.",
"%s is a slippery slope that leads to %s.",
"%s: good to the last drop.",
"%s: kid-tested, mother-approved.",
"%s? There\'s an app for that.",
"%s. Betcha can\'t have just one!",
"%s. High five, bro.",
"%s. It\'s a trap!",
"%s. That\'s how I want to die.",
"A romantic, candlelit dinner would be incomplete without %s.",
"After Hurricane Katrina, Sean Penn brought %s to the people of New Orleans.",
"Alternative medicine is now embracing the curative powers of %s.",
"And the Academy Award for %s goes to %s.",
"Anthropologists have recently discovered a primitive tribe that worships %s.",
"BILLY MAYS HERE FOR %s.",
"But before I kill you, Mr. Bond, I must show you %s.",
"Coming to Broadway this season, %s: The Musical.",
"Due to a PR fiasco, Walmart no longer offers %s.",
"During Picasso\'s often-overlooked Brown Period, he produced hundreds of paintings of %s.",
"During sex, I like to think about %s.",
"For my next trick, I will pull %s out of %s.",
"How am I maintaining my relationship status? %s",
"I do not know with what weapons World War III will be fought, but World War IV will be fought with %s.",
"I drink to forget %s.",
"I got 99 problems but %s ain\'t one.",
"I never truly understood %s until I encountered %s.",
"I wish I hadn\'t lost the instruction manual for %s.",
"I\'m sorry, Professor, but I couldn\'t complete my homework because of %s.",
"In 1,000 years, when paper money is but a distant memory, %s will be our currency.",
"In a world ravaged by %s, our only solace is %s.",
"In an attempt to reach a wider audience, the Smithsonian Museum of Natural History has opened an interactive exhibit on %s.",
"In his new summer comedy, Rob Schneider is %s trapped in the body of %s.",
"In M. Night Shyamalan\'s new movie, Bruce Willis discovers that %s had really been %s all along.",
"In Michael Jackson\'s final moments, he thought about %s.",
"In the new Disney Channel Original Movie, Hannah Montana struggles with %s for the first time.",
"Instead of coal, Santa now gives the bad children %s.",
"It\'s a pity that kids these days are all getting involved with %s.",
"Life was difficult for cavemen before %s.",
"Lifetime presents %s, the story of %s.",
"Major League Baseball has banned %s for giving players an unfair advantage.",
"Make a haiku. %s %s %s",
"MTV\'s new reality show features eight washed-up celebrities living with %s.",
"Next from J.K. Rowling: Harry Potter and the Chamber of %s.",
"Rumor has it that Vladimir Putin\'s favorite dish is %s stuffed with %s.",
"Studies show that lab rats navigate mazes 50% faster after being exposed to %s.",
"That\'s right, I killed %s. How, you ask? %s.",
"The class field trip was completely ruined by %s.",
"The U.S. has begun airdropping %s to the children of Afghanistan.",
"This is the way the world ends. Not with a bang but with %s.",
"TSA guidelines now prohibit %s on airplanes.",
"War! What is it good for? %s",
"What am I giving up for Lent? %s",
"What are my parents hiding from me? %s",
"What did I bring back from Mexico? %s",
"What did Vin Diesel eat for dinner? %s",
"What do old people smell like? %s",
"What does Dick Cheney prefer? %s",
"What don\'t you want to find in your Chinese food? %s",
"What ended my last relationship? %s",
"What gets better with age? %s",
"What gives me uncontrollable gas? %s",
"What helps Obama unwind? %s",
"What is Batman\'s guilty pleasure? %s",
"What never fails to liven up the party? %s",
"What will always get you laid? %s",
"What will I bring back in time to convince people that I am a powerful wizard? %s",
"What would grandma find disturbing, yet oddly charming? %s",
"What\'s a girl\'s best friend? %s",
"What\'s my anti-drug? %s",
"What\'s my secret power? %s",
"What\'s Teach for America using to inspire inner city students to succeed? %s",
"What\'s that smell? %s",
"What\'s that sound? %s",
"What\'s the crustiest? %s",
"What\'s the most emo? %s",
"What\'s the new fad diet? %s",
"What\'s the next Happy Meal toy? %s",
"What\'s the next superhero/sidekick duo? %s & %s",
"What\'s there a ton of in heaven? %s",
"When I am a billionaire, I shall erect a 50-foot statue to commemorate %s.",
"When I am President of the United States, I will create the Department of %s.",
"When I was tripping on acid, %s turned into %s.",
"When I\'m in prison, I\'ll have %s smuggled in.",
"When Pharaoh remained unmoved, Moses called down a Plague of %s.",
"While the United States raced the Soviet Union to the moon, the Mexican government funneled millions of pesos into research on %s.",
"White people like %s.",
"Who stole the cookies from the cookie jar? %s",
"Why am I sticky? %s",
"Why can\'t I sleep at night? %s",
"Why do I hurt all over? %s",
"What brought the orgy to a grinding halt? %s",
"He who controls %s controls the world.",
"The CIA now interrogates enemy agents by repeatedly subjecting them to %s.",
"Dear sir or madam, We regret to inform you that the Office of %s has denied your request for %s.",
"In Rome, there are whisperings that the Vatican has a secret room devoted to %s.",
"Science will never explain the origin of %s.",
"When all else fails, I can always masturbate to %s.",
"I learned the hard way that you can\'t cheer up a grieving friend with %s.",
"In its new tourism campaign, Detroit proudly proclaims that it has finally eliminated %s.",
"An international tribunal has found %s guilty of %s.",
"The socialist governments of Scandinavia have declared that access to %s is a basic human right.",
"In his new self-produced album, Kanye West raps over the sounds of %s.",
"What\'s the gift that keeps on giving? %s",
"This season on Man vs. Wild, Bear Grylls must survive in the depths of the Amazon with only %s and his wits.",
"When I pooped, what came out of my butt? %s",
"In the distant future, historians will agree that %s marked the beginning of America\'s decline.",
"In a pinch, %s can be a suitable substitute for %s.",
"What has been making life difficult at the nudist colony? %s",
"Michael Bay\'s new three-hour action epic pits %s against %s.",
"And I would have gotten away with it, too, if it hadn\'t been for %s!"
    ];

    this.createArray();
}

HumQuestionCards.prototype = new baseCards.BaseCards;

HumQuestionCards.prototype.getCard = function(i) {
    var text = this.cardArray[i];
//    console.log('text: ' + text);
    return new humCard.HumCard(i, this.cardArray[i]);
}

exports.HumQuestionCards = HumQuestionCards;