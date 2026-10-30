import { SCREENS, escapeHTML as esc } from './core.mjs';
import { nativeIcon as icon } from './native.mjs';

export const PLATFORMS = {
  ios: { label: 'iOS · iPhone', description: 'Your trading day, in your pocket.', previewLabel: 'iPhone preview · sample data' },
  macos: { label: 'macOS · Mac', description: 'Your full workspace, with room to explore.', previewLabel: 'Mac preview · sample data' },
};
// Platform is a viewing preference, like appearance. Tour restoration never
// rewinds it, and changing it never resets the visitor's plan or demo work.
export function changePlatform(state, platform) {
  if (Object.hasOwn(PLATFORMS, platform)) state.platform = platform;
  return state;
}
export const MAC_GROUPS = [
  ['', ['home']],
  ['Tools', ['macd', 'patterns', 'stops']],
  ['Calendars', ['earnings', 'economy', 'stream']],
  ['Community', ['chat']],
];
export const MAC_SHORTCUTS = MAC_GROUPS.flatMap(([, ids]) => ids);
const meta = id => SCREENS.find(row => row[0] === id);
export function renderMacFrame(state, page, sheet) {
  const selected=MAC_SHORTCUTS.includes(state.screen)?state.screen:state.macSection||'home';
  const row=id=>{const [,label,,symbol]=meta(id);return `<button data-screen="${id}" class="mac-nav-item ${selected===id?'selected':''}" ${selected===id?'aria-current="page"':''}>${icon(symbol)}<span>${label}</span>${id==='chat'?'<span class="mac-unread">3</span>':''}</button>`;};
  return `<header class="mac-titlebar"><span class="mac-traffic" aria-hidden="true"><i></i><i></i><i></i></span><button data-action="mac-sidebar" class="mac-sidebar-toggle" aria-label="Toggle Mac sidebar" aria-expanded="${!state.macSidebarCollapsed}">${icon('menu')}</button><strong>Friendly Trader</strong><button class="mac-go-button" data-action="mac-menu" aria-expanded="${!!state.macMenuOpen}">Go</button>${state.macMenuOpen?`<div class="mac-go-menu" aria-label="Go to a page">${MAC_SHORTCUTS.map((id,i)=>`<button data-screen="${id}"><span>${meta(id)[1]}</span><kbd>⌘${(i+1)%10}</kbd></button>`).join('')}<hr><button data-screen="profile"><span>Profile…</span><kbd>⌘,</kbd></button><button data-action="mac-notifications"><span>Notifications…</span><kbd>⇧⌘N</kbd></button></div>`:''}</header><div class="mac-body ${state.macSidebarCollapsed?'sidebar-collapsed':''}"><aside class="mac-sidebar" aria-label="Mac navigation"><div class="mac-sidebar-brand">Friendly Trader</div><nav aria-label="Mac app sections">${MAC_GROUPS.map(([title,ids])=>`<div class="mac-nav-group">${title?`<h3>${title}</h3>`:''}${ids.map(row).join('')}</div>`).join('')}</nav><footer class="mac-sidebar-footer"><button data-screen="profile" class="mac-profile" aria-label="Your Mac profile"><span class="avatar">${state.avatar==='A'?icon('person'):esc(state.avatar)}</span><strong>${esc(state.name)}</strong></button><button data-action="mac-notifications" class="icon-button" aria-label="Mac notifications">${icon('bell')}</button></footer></aside><section class="mac-workspace ${sheet?'has-sheet':''}" aria-label="${meta(state.screen)?.[1]||'App'} workspace"><div class="mac-surface ${sheet?'native-sheet':''} ${state.detail==='chart'?'mac-expanded-chart':''}">${page}</div></section></div>`;
}
