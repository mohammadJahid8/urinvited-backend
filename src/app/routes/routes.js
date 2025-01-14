import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route.js';
import { UserRoutes } from '../modules/user/user.route.js';
import { VideoRoutes } from '../modules/video/video.route.js';
import { EventRoutes } from '../modules/event/event.route.js';
import { ShareRoutes } from '../modules/share/share.route.js';


const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/video',
    route: VideoRoutes,
  },
  {
    path: '/event',
    route: EventRoutes,
  },
  {
    path: '/share',
    route: ShareRoutes,
  },
];

moduleRoutes?.forEach(route => router.use(route.path, route.route));

export default router;
