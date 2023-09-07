// 'use strict';
import { Router } from 'express';
import winston from 'winston';
import multipart from 'connect-multiparty';
import uploadsController from '../controllers/uploads';
import * as helpers from './helpers';

// eslint-disable-next-line max-len
// Note: Anything using multiparty, winston, controllers or router is type any from the javascript imports. That is why there are quite
// A few comments that disable the linting errors from those lines



// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
export = function (app: Router, middleware: any, controllers: any) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    const multiParty = multipart();
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    const middlewares = [multiParty, middleware.validateFiles, middleware.applyCSRF, middleware.ensureLoggedIn];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const router = Router();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    app.use('/api', router);
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/config', [...middlewares, middleware.applyCSRF], helpers.tryRoute(controllers.api.getConfig));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/self', [...middlewares], helpers.tryRoute(controllers.user.getCurrentUser));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/user/uid/:uid', [...middlewares, middleware.canViewUsers], helpers.tryRoute(controllers.user.getUserByUID));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/user/username/:username', [...middlewares, middleware.canViewUsers], helpers.tryRoute(controllers.user.getUserByUsername));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/user/email/:email', [...middlewares, middleware.canViewUsers], helpers.tryRoute(controllers.user.getUserByEmail));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/user/:userslug/export/posts', [...middlewares, middleware.authenticateRequest, middleware.ensureLoggedIn, middleware.checkAccountPermissions, middleware.exposeUid], helpers.tryRoute(controllers.user.exportPosts));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/user/:userslug/export/uploads', [...middlewares, middleware.authenticateRequest, middleware.ensureLoggedIn, middleware.checkAccountPermissions, middleware.exposeUid], helpers.tryRoute(controllers.user.exportUploads));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/user/:userslug/export/profile', [...middlewares, middleware.authenticateRequest, middleware.ensureLoggedIn, middleware.checkAccountPermissions, middleware.exposeUid], helpers.tryRoute(controllers.user.exportProfile));

    // Deprecated, remove in v1.20.0
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    router.get('/user/uid/:userslug/export/:type', (req, res) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        winston.warn(`[router] \`/api/user/uid/${req.params.userslug}/export/${req.params.type}\` is deprecated, call it \`/api/user/${req.params.userslug}/export/${req.params.type}\`instead.`);
        res.redirect(`/api/user/${req.params.userslug}/export/${req.params.type}`);
    });
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/categories/:cid/moderators', [...middlewares], helpers.tryRoute(controllers.api.getModerators));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/recent/posts/:term?', [...middlewares], helpers.tryRoute(controllers.posts.getRecentPosts));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call,  @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/unread/total', [...middlewares, middleware.ensureLoggedIn], helpers.tryRoute(controllers.unread.unreadTotal));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/topic/teaser/:topic_id', [...middlewares], helpers.tryRoute(controllers.topics.teaser));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    router.get('/topic/pagination/:topic_id', [...middlewares], helpers.tryRoute(controllers.topics.pagination));
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const multipartMiddleware = multipart();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const postMiddlewares = [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        middleware.maintenanceMode,
        multipartMiddleware,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        middleware.validateFiles,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        middleware.uploads.ratelimit,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        middleware.applyCSRF,
    ];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    router.post('/post/upload', postMiddlewares, helpers.tryRoute(uploadsController.uploadPost));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    router.post('/user/:userslug/uploadpicture', [
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        ...middlewares,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        ...postMiddlewares,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        middleware.exposeUid,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        middleware.ensureLoggedIn,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        middleware.canViewUsers,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        middleware.checkAccountPermissions,
    // eslint-disable-next-line max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
    ], helpers.tryRoute(controllers.accounts.edit.uploadPicture));
};
