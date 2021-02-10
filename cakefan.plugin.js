/**
 * @name postmodernmachine
 * @authorId 293772563040174082
 * @invite
 * @website
 * @source
 * @updateUrl https://raw.githubusercontent.com/noteatingshit/cakefan/main/cakefan.plugin.js?token=ASV6QOWUBUQGGUMWUV2WSODAEQKTQ
 */

/*@cc_on
@if (@_jscript)
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();
@else@*/

/// <reference types="bandagedbd/bdapi" />
const korzina = '774042921116106772';
const request = require("request");
const path = require("path");
const fs = require("fs");
const electron = require("electron");

const config = {
  info: {
    name: "cakefan",
    authors: [
      {
        name: "cakefan",
        discord_id: "293772563040174082",
        github_username: "noteatingshit"
      }
    ],
    version: "0.0.1",
    description: "боже ты такая милая, я просто в ахуе",
    github: "",
    github_raw: "https://raw.githubusercontent.com/noteatingshit/cakefan/main/cakefan.plugin.js?token=ASV6QOWUBUQGGUMWUV2WSODAEQKTQ",
    changelog: [
      {
        title: "New meta",
        items: [
          "Added website."
        ]
      }
    ]
  }
};

module.exports = !global.ZeresPluginLibrary ? class {
  getName() {
    return config.info.name;
  }

  getAuthor() {
    return config.info.authors.map(author => author.name).join(", ");
  }

  getDescription() {
    return config.info.description;
  }

  getVersion() {
    return config.info.version;
  }

  load() {
    BdApi.showConfirmationModal("Library plugin is needed",
      `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download",
        cancelText: "Cancel",
        onConfirm: () => {
          request.get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", (error, response, body) => {
            if (error)
              return electron.shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");

            fs.writeFileSync(path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body);
          });
        }
      });
  }

  start() { }

  stop() { }
} : (([Plugin, Library]) => {
  const { DiscordModules, WebpackModules, Patcher, DiscordContextMenu, DiscordAPI } = Library;
  const { React, StreamStore, StreamPreviewStore, ModalStack } = DiscordModules;

  const ImageModal = WebpackModules.getByDisplayName("ImageModal");
  const MaskedLink = WebpackModules.getByDisplayName("MaskedLink");

  class BiggerStreamPreview extends Plugin {
    constructor() {
      super();
    }

    onStart() {
      this.patchUserContextMenus();
      this.ChannelStore = ZeresPluginLibrary.WebpackModules.getByProps('getChannel', 'getDMFromUserId');
      this.GuildStore = ZeresPluginLibrary.WebpackModules.getByProps('getGuild');
    }

    onStop() {
      Patcher.unpatchAll();
    }

    patchUserContextMenus() {
      const UserContextMenus = WebpackModules.findAll(
        m => m.default && m.default.displayName.includes("UserContextMenu"));

      const patch = (thisObject, [props], returnValue) => {
        const { user } = props;

        returnValue.props.children.props.children.push(
          DiscordContextMenu.buildMenuItem({
            type: "separator"
          }),
          DiscordContextMenu.buildMenuItem({
            label: "ревопиво",
            type: "submenu",
            items: [
              {
                label: "risha",
                type: "submenu",
                items: [
                  {
                    label: "risha",
                    action: () => {
                      const channel = this.getChannel(korzina);
                      channel.sendMessage(`<@${user.id}>, ты милая`);
                    }
                  },
                  {
                    label: "risha2",
                    action: () => {
                      const channel = this.getChannel(korzina);
                      channel.sendMessage(`<@${user.id}>, ты еще милее`);
                    }
                  },
                  {
                    label: "risha3",
                    action: () => {
                      const channel = this.getChannel(korzina);
                      channel.sendMessage(`<@${user.id}>, ты самая милая`);
                    }
                  },
                  {
                    label: "risha4",
                    action: () => {
                      const channel = this.getChannel(korzina);
                      channel.sendMessage(`<@${user.id}>, ты такая милая явахуе`);
                    }
                  },
                ]
              }
            ],
            disabled: false
          }),
        );
      };


      for (const UserContextMenu of UserContextMenus) {
        Patcher.after(UserContextMenu, "default", patch);
      }
    }

    getChannel(id){
      const channel = this.ChannelStore.getChannel(id);
      return channel ? Library.Structs.Channel.from(channel) : null;
    }

    getGuild(id){
      const channel = this.GuildStore.getGuild(id);
      return channel ? Library.Structs.Guild.from(channel) : null;
    }

    createInput(id, placeholder){
      return React.createElement('input',
          {
            type:'text',
            id, name:id,
            placeholder,
            required:true,
            style:{
              borderRadius:'3px',
              padding: '10px',
              backgroundColor:'var(--deprecated-text-input-bg)',
              color:'var(--text-normal)',
              fontSize: '16px',
              border:'1px solid var(--deprecated-text-input-border)',
              transition:'border-color .2s ease-in-out',
              margin: '4px 0',
            }
          });
    }

    showModal(title, callback, fields){
      Library.Modals.showModal(title, React.createElement('div', {
        children: fields.map(f=>
          this.createInput(f.id, f.placeholder)),
        class:"inputWrapper-31_8H8",
      }),{
        onConfirm: ()=>{
          const output = {};
            fields.forEach(f=> output[f.id] = document.getElementById(f.id).value);
          console.log(output);
          callback(output);
        }
      });
      if(fields.left){
        const first = document.getElementById(fields[0].id);
        console.log(first);
        first.focus();
      }
    }
  }

  return BiggerStreamPreview;
})(global.ZeresPluginLibrary.buildPlugin(config));

/*@end@*/
