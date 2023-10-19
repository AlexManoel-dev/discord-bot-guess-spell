import { ApplicationCommandData, ButtonInteraction, Collection, CommandInteraction, CommandInteractionOptionResolver, ModalSubmitInteraction, StringSelectMenuInteraction } from 'discord.js';
import { ExtendedClient } from '../ExtendedClient';

interface ICommandProps {
  client: ExtendedClient;
  interaction: CommandInteraction;
  options: CommandInteractionOptionResolver;
};

export type ComponentsButton = Collection<string, (interaction: ButtonInteraction) => any>;
export type ComponentsSelect = Collection<string, (interaction: StringSelectMenuInteraction) => any>;
export type ComponentsModal = Collection<string, (interaction: ModalSubmitInteraction) => any>;

interface CommandComponents {
  buttons?: ComponentsButton;
  selects?: ComponentsSelect;
  modals?: ComponentsModal;
};

export type CommandType = ApplicationCommandData & CommandComponents & {
  run(props: ICommandProps): any;
};

export class Command {
  constructor(options: CommandType) {
    options.dmPermission = false;
    Object.assign(this, options);
  }
}
