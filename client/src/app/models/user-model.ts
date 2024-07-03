import { t } from "mobx-state-tree";

export const User = t.model('User', {
    id: t.string,
    email: t.string,
    firstName: t.string,
    lastName: t.string,
    balance: t.maybeNull(t.number),
    role: t.string,
    avatarId: t.maybeNull(t.string),
});
