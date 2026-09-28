require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const commands = [
    new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Envia uma embed com botão')
        .addStringOption(option =>
            option.setName('embed')
                .setDescription('Texto da embed')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Nome do botão')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Link do botão')
                .setRequired(true)
        )
        .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registrarComando() {
    try {
        console.log('Registrando /embed...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log('/embed registrado!');
    } catch (error) {
        console.error(error);
    }
}

client.once('ready', () => {
    console.log(`Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== 'embed') return;

    const texto = interaction.options.getString('embed');
    const nome = interaction.options.getString('nome');
    const link = interaction.options.getString('link');

    try {
        new URL(link);
    } catch {
        return interaction.reply({
            content: '❌ O link informado não é válido.',
            ephemeral: true
        });
    }

    const embed = new EmbedBuilder()
        .setDescription(texto);

    const button = new ButtonBuilder()
        .setLabel(nome)
        .setURL(link)
        .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder()
        .addComponents(button);

    await interaction.reply({
        embeds: [embed],
        components: [row]
    });
});

registrarComando();
client.login(process.env.TOKEN);
