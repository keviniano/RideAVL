import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Events, Content } from 'ionic-angular';

// Models
import { User } from '../../models/user';
import { ChatMessage } from '../../models/chat-message';

// Providers
import { GlobalProvider } from '../../providers/global/global';
import { ChatProvider } from '../../providers/chat/chat';

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: ElementRef;
  @ViewChild('quickResponseList') quickResponseList: Select;

  msgList: ChatMessage[] = [];
  user: User;
  editorMsg = '';

  selectOptions: any;
  

  constructor(navParams: NavParams,
              private chatService: ChatProvider,
              private global: GlobalProvider,
              private events: Events) {
              this.user = this.global.user;
              
              this.selectOptions = {
                title: 'Quick Response',
                subTitle: 'Select a response to send',
                mode: 'md'
              };
  }

  showQuickResponse(){
    this.quickResponseList.open();
  }

  ionViewWillLeave() {
    this.chatService.disconnect();
    this.events.unsubscribe('chat:new');
  }

  ionViewWillEnter() {
    this.events.subscribe('chat:new', (msg) => {
      this.pushNewMsg(msg);
    });
    this.chatService.connect();
  }

  ionViewDidEnter() {
    //get message list
    this.getMsgs();
  }

  onFocus() {
    this.scrollToBottom();
  }

  /**
   * @name getMsg
   * @returns {Promise<ChatMessage[]>}
   */
  getMsgs() {
    // Get mock message list
    return this.chatService
    .getMsgList()
    .subscribe(res => {
      this.msgList = res;
      this.scrollToBottom();
    });
  }

  /**
   * @name sendMsg
   */
  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // Mock message
    let created_at = Date.now();
    const id = created_at.toString();
    const newMsg: ChatMessage = {
      messageId: id,
      sender_id: this.user.id,
      sender_name: this.user.name,
      driver_id: this.user.driver_id,
      provider_id: this.user.provider_id,
      body: this.editorMsg,
      created_at: created_at,
      status: 'pending'
    };

    this.pushNewMsg(newMsg);
    this.editorMsg = '';

    this.chatService.create(newMsg)
    .subscribe(() => {
      let index = this.getMsgIndexById(id);
      if (index !== -1) {
        this.msgList[index].status = 'success';
      }
    })
  }

  pushNewMsg(msg: ChatMessage) {
    this.msgList.push(msg);
    this.scrollToBottom();
  }

  getMsgIndexById(id: string) {
    return this.msgList.findIndex(e => e.messageId === id)
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  private focus() {
    if (this.messageInput && this.messageInput.nativeElement) {
      this.messageInput.nativeElement.focus();
    }
  }

  private setTextareaScroll() {
    const textarea =this.messageInput.nativeElement;
    textarea.scrollTop = textarea.scrollHeight;
  }
}