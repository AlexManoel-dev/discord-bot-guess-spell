import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, Collection, EmbedBuilder, Message } from 'discord.js';
import { Command } from '../../structs/types/Command';
import { request } from 'undici';

const abilities: { [key: number]: string; } = {
  0: 'Q',
  1: 'W',
  2: 'E',
  3: 'R',
};

let currentAbilityToButton: string;
let currentMemberToButton: string;

const congratsEmbed = new EmbedBuilder().setTitle('Você acertou novamente! ✅');

const wrongEmbed = new EmbedBuilder().setTitle('Você errou! ❌');

export default new Command({
  name: 'guess',
  description: 'Guess the champion, based on a random ability',
  type: ApplicationCommandType.ChatInput,
  async run({ interaction }) {
    if(!interaction.inCachedGuild()) return;

    const { member, channel } = interaction;

    currentMemberToButton = member.user.username;

    if(channel?.type !== ChannelType.GuildText) {
      interaction.reply({ ephemeral: true, content: 'Este comando não pode ser utilizado neste canal!' });
    }

    // Get all champions
    const championsResponse = await request("http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/champion.json");
    const championsResponseData = await championsResponse.body.json() as any;
    const champions = Object.values(championsResponseData.data).map((champion: any) => ({
      id: champion.id,
      name: champion.name.replace("'", '').replace(".", '').replaceAll(" ", '').replace('&', 'e').trim().toLowerCase()
    }));

    const bardIndex = champions.map((champion) => champion.id).indexOf('Bard');

    if (bardIndex !== -1) {
      champions[bardIndex].name = 'bardo';
    }

    // Get a random champion
    const randomChampion = champions[Math.floor(Math.random() * champions.length)];

    // Get current champion spells
    const spellsResponse = await request(`http://ddragon.leagueoflegends.com/cdn/13.16.1/data/en_US/champion/${randomChampion.id}.json`);
    const spellsResponseData = await spellsResponse.body.json() as any;
    const currentRandomChampion = spellsResponseData.data[randomChampion.id];
    const currentRandomChampionSpells = currentRandomChampion.spells.map((spell: any) => spell.id);

    // Get a current random champion random spell
    const currentChampionRandomSpell = currentRandomChampionSpells[Math.floor(Math.random() * currentRandomChampionSpells.length)];

    const currentAbilityIndexInSpells = currentRandomChampionSpells.indexOf(currentChampionRandomSpell);

    const currentAbility = abilities[currentAbilityIndexInSpells];

    currentAbilityToButton = currentAbility;

    // Get current spell image
    const spellImage = new EmbedBuilder()
      .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/13.16.1/img/spell/${currentChampionRandomSpell}.png`)
      .setTitle('Desafio!')
      .setDescription('De qual campeão é essa habilidade?');

    interaction.reply({ embeds: [spellImage] });

    // Log to know champion and ability to test
    console.log(randomChampion.id, currentAbility);

    // Filtra somente as mensagens de quem chamou o comando
    const filter = (m: Message) => m.author.id === member.id;

    const message = await channel?.awaitMessages({ filter, max: 1 }).catch(() => null);
    const msg = message?.first();
    const messageToCompare = msg?.content.replace("'", '').replace(".", '').replaceAll(" ", '').trim().toLowerCase();

    const congratsEmbed = new EmbedBuilder()
      .setTitle('Você acertou! ✅')
      .setDescription('Mas qual habilidade? Q, W, E ou R?');

    const wrongEmbed = new EmbedBuilder().setTitle('Você errou! ❌');

    const finalCongratsEmbed = new EmbedBuilder()
      .setTitle('Você acertou novamente! ✅');

    const row = new ActionRowBuilder<ButtonBuilder>({components: [
      new ButtonBuilder({ customId: 'q-button', label: 'Q', style: ButtonStyle.Secondary }),
      new ButtonBuilder({ customId: 'w-button', label: 'W', style: ButtonStyle.Secondary }),
      new ButtonBuilder({ customId: 'e-button', label: 'E', style: ButtonStyle.Secondary }),
      new ButtonBuilder({ customId: 'r-button', label: 'R', style: ButtonStyle.Secondary })
    ]});

    // TODO: Ver como fazer tipo "sessão", pra ser somente um membro de cada vez(já funciona o fato de somente uma pessoa poder responder quando chamar o bot, no caso a própria pessoa que chamou)
    // Fazer com que enquanto uma pessoa tem chamado o /guess, outra não possa se o usuário anterior não tiver terminado
    // Para isso, é necessário saber quem chamou o /guess, se pa da pra saber no interaction

    // TODO: Também fazer com quem não tenha chamado o bot, caso responda, sua mensagem seja apagada instantaneamente
    // Para tal, conferir com o log abaixo se da pra fazer como username, já que é único
    // console.log('interaction', interaction);
    if(messageToCompare === randomChampion.name) {
      channel?.send({
        embeds: [congratsEmbed],
        components: [row]
      }).then(async () => {
        const message = await channel?.awaitMessages({ filter, max: 1 }).catch(() => null);
        const msg = message?.first();

        if(msg?.content.toLowerCase() === currentAbility.toLocaleLowerCase()) {
          channel.send({
            embeds: [finalCongratsEmbed]
          });
        } else {
          channel.send({
            embeds: [wrongEmbed]
          });
        }
      });
    } else {
      channel?.send({
        embeds: [wrongEmbed]
      });
    }
  },
  // Talvez fazer os botões funcionar, mas quando clicar ele tem que trazer a funcionalidade e não permitir que clique mais
  // buttons: new Collection([
  //   ['q-button', (interaction) => {
  //     if(currentMemberToButton === interaction.user.username) {
  //       if(interaction.customId.split('-')[0].toLowerCase() === currentAbilityToButton.toLowerCase()) {
  //         interaction.reply({
  //           embeds: [congratsEmbed]
  //         });
  //       } else {
  //         interaction.reply({
  //           embeds: [wrongEmbed]
  //         });
  //       }
  //     } else {
  //       interaction.reply({
  //         ephemeral: true,
  //         content: 'Esses botões não são para você!'
  //       });
  //     }
  //   }],
  //   ['w-button', (interaction) => {
  //     if(currentMemberToButton === interaction.user.username) {
  //       if(interaction.customId.split('-')[0].toLowerCase() === currentAbilityToButton.toLowerCase()) {
  //         interaction.reply({
  //           embeds: [congratsEmbed] 
  //         });
  //       } else {
  //         interaction.reply({
  //           embeds: [wrongEmbed]
  //         });
  //       }
  //     } else {
  //       interaction.reply({
  //         ephemeral: true,
  //         content: 'Esses botões não são para você!'
  //       });
  //     }
  //   }],
  //   ['e-button', (interaction) => {
  //     if(currentMemberToButton === interaction.user.username) {
  //       if(interaction.customId.split('-')[0].toLowerCase() === currentAbilityToButton.toLowerCase()) {
  //         interaction.reply({
  //           embeds: [congratsEmbed] 
  //         });
  //       } else {
  //         interaction.reply({
  //           embeds: [wrongEmbed]
  //         });
  //       }
  //     } else {
  //       interaction.reply({
  //         ephemeral: true,
  //         content: 'Esses botões não são para você!'
  //       });
  //     }
  //   }],
  //   ['r-button', (interaction) => {
  //     if(currentMemberToButton === interaction.user.username) {
  //       if(interaction.customId.split('-')[0].toLowerCase() === currentAbilityToButton.toLowerCase()) {
  //         interaction.reply({
  //           embeds: [congratsEmbed] 
  //         });
  //       } else {
  //         interaction.reply({
  //           embeds: [wrongEmbed]
  //         });
  //       }
  //     } else {
  //       interaction.reply({
  //         ephemeral: true,
  //         content: 'Esses botões não são para você!'
  //       });
  //     }
  //   }],
  // ])
});