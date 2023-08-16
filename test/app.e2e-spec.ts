import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { UpdateUserRequest } from 'src/user/dto';
import { BookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const baseUrl = 'http://localhost:8000/api/v1';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    await app.listen(8000);

    prisma = app.get(PrismaService);

    await prisma.cleanDB();
    pactum.request.setBaseUrl(baseUrl);
  });

  afterAll(() => {
    app.close();
  });

  describe('auth', () => {
    describe('sign-up', () => {
      const happyBody: AuthDto = {
        email: 'me@there.com',
        password: '123',
      };

      //! SHOULD FAIL
      it('should fail no body', () => {
        return pactum.spec().post(`/auth/sign-up`).expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid email', () => {
        return pactum
          .spec()
          .post(`/auth/sign-up`)
          .withBody({
            email: 'me@there',
            password: '123',
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail no email', () => {
        return pactum
          .spec()
          .post(`/auth/sign-up`)
          .withBody({
            password: '123',
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid password', () => {
        return pactum
          .spec()
          .post(`/auth/sign-up`)
          .withBody({
            email: 'me@there.com',
            password: 123,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail no password', () => {
        return pactum
          .spec()
          .post(`/auth/sign-up`)
          .withBody({
            email: 'me@there',
          })
          .expectStatus(400);
      });

      //* SHOULD PASS
      it('should pass sign up', () => {
        return pactum
          .spec()
          .post(`/auth/sign-up`)
          .withBody(happyBody)
          .expectStatus(201);
      });
    });

    describe('sign-in', () => {
      const happyBody: AuthDto = {
        email: 'me@there.com',
        password: '123',
      };

      //! SHOULD FAIL
      it('should fail no body', () => {
        return pactum.spec().post(`/auth/sign-in`).expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid email', () => {
        return pactum
          .spec()
          .post(`/auth/sign-in`)
          .withBody({
            email: 'me@there',
            password: '123',
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail no email', () => {
        return pactum
          .spec()
          .post(`/auth/sign-in`)
          .withBody({
            password: '123',
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid password', () => {
        return pactum
          .spec()
          .post(`/auth/sign-in`)
          .withBody({
            email: 'me@there.com',
            password: 123,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail no password', () => {
        return pactum
          .spec()
          .post(`/auth/sign-in`)
          .withBody({
            email: 'me@there',
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail wrong credentials', () => {
        return pactum
          .spec()
          .post(`/auth/sign-in`)
          .withBody({
            email: 'me@there.com',
            password: '1234',
          })
          .expectStatus(403);
      });

      //* SHOULD PASS
      it('should pass sign in', () => {
        return pactum
          .spec()
          .post(`/auth/sign-in`)
          .withBody(happyBody)
          .expectStatus(201)
          .stores('userAt', 'token');
      });
    });
  });

  describe('users', () => {
    describe('get user', () => {
      //! SHOULD FAIL
      it('should fail no token', () => {
        return pactum.spec().get(`/users`).expectStatus(401);
      });

      //* SHOULD PASS
      it('should pass get user', () => {
        return pactum
          .spec()
          .get(`/users`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('update user', () => {
      const happyBody: UpdateUserRequest = {
        firstName: 'me',
        lastName: 'here',
      };

      //! SHOULD FAIL
      it('should fail no body', () => {
        return pactum
          .spec()
          .patch(`/users`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail no firstName', () => {
        return pactum
          .spec()
          .patch(`/users`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            lastName: happyBody.lastName,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail no lastName', () => {
        return pactum
          .spec()
          .patch(`/users`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            firstName: happyBody.firstName,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid firstName', () => {
        return pactum
          .spec()
          .patch(`/users`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            firstName: 3,
            lastName: happyBody.lastName,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid lastName', () => {
        return pactum
          .spec()
          .patch(`/users`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            firstName: happyBody.firstName,
            lastName: 3,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail no token', () => {
        return pactum
          .spec()
          .patch(`/users`)
          .withBody({
            firstName: happyBody.firstName,
            lastName: happyBody.lastName,
          })
          .expectStatus(401);
      });

      //* SHOULD PASS
      it('should pass update user', () => {
        return pactum
          .spec()
          .patch(`/users`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(happyBody)
          .expectStatus(200)
          .expectBodyContains(happyBody.firstName)
          .expectBodyContains(happyBody.lastName);
      });
    });
  });

  describe('bookmarks', () => {
    describe('create bookmark', () => {
      const happyBody: BookmarkDto = {
        title: 'test title',
        description: 'test description',
        link: 'test link',
      };

      //! SHOULD FAIL
      it('should fail no token', () => {
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withBody(happyBody)
          .expectStatus(401);
      });

      //! SHOULD FAIL
      it('should fail no title', () => {
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            description: happyBody.description,
            link: happyBody.link,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid title', () => {
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            description: happyBody.description,
            link: happyBody.link,
            title: 3,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail no link', () => {
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            title: happyBody.title,
            description: happyBody.description,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid link', () => {
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            description: happyBody.description,
            link: 3,
            title: happyBody.title,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid description', () => {
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            description: 3,
            link: happyBody.link,
            title: happyBody.title,
          })
          .expectStatus(400);
      });

      //* SHOULD PASS
      it('should pass create bookmark', () => {
        return pactum
          .spec()
          .post(`/bookmarks`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(happyBody)
          .expectStatus(201)
          .expectBodyContains(happyBody.description)
          .expectBodyContains(happyBody.link)
          .expectBodyContains(happyBody.title)
          .stores('bmId', 'id');
      });
    });

    describe('list bookmarks', () => {
      //! SHOULD FAIL
      it('should fail no token', () => {
        return pactum.spec().get(`/bookmarks`).expectStatus(401);
      });

      //* SHOULD PASS
      it('should pass list bookmark', () => {
        return pactum
          .spec()
          .get(`/bookmarks`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('get bookmark', () => {
      //! SHOULD FAIL
      it('should fail no token', () => {
        return pactum.spec().get('/bookmarks/$S{bmId}').expectStatus(401);
      });

      //! SHOULD FAIL
      it('should fail invalid id', () => {
        return pactum
          .spec()
          .get('/bookmarks/null')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail non exiting id', () => {
        return pactum
          .spec()
          .get('/bookmarks/150044235')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404);
      });

      //* SHOULD PASS
      it('should pass get bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks/$S{bmId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('update bookmark', () => {
      const happyBody: BookmarkDto = {
        title: 'test2 title',
        description: 'test2 description',
        link: 'test2 link',
      };

      //! SHOULD FAIL
      it('should fail no token', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/$S{bmId}`)
          .withBody(happyBody)
          .expectStatus(401);
      });

      //! SHOULD FAIL
      it('should fail no title', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/$S{bmId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            description: happyBody.description,
            link: happyBody.link,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid title', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/$S{bmId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            description: happyBody.description,
            link: happyBody.link,
            title: 3,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail no link', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/$S{bmId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            title: happyBody.title,
            description: happyBody.description,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid link', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/$S{bmId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            description: happyBody.description,
            link: 3,
            title: happyBody.title,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid description', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/$S{bmId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody({
            description: 3,
            link: happyBody.link,
            title: happyBody.title,
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail invalid id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/null')
          .withBody(happyBody)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail non exiting id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/150044235')
          .withBody(happyBody)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404);
      });

      //* SHOULD PASS
      it('should pass update bookmark', () => {
        return pactum
          .spec()
          .patch(`/bookmarks/$S{bmId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(happyBody)
          .expectStatus(200)
          .expectBodyContains(happyBody.description)
          .expectBodyContains(happyBody.title)
          .expectBodyContains(happyBody.link)
          .stores('bmId', 'id');
      });
    });

    describe('delete bookmark', () => {
      //! SHOULD FAIL
      it('should fail no token', () => {
        return pactum.spec().delete('/bookmarks/$S{bmId}').expectStatus(401);
      });

      //! SHOULD FAIL
      it('should fail invalid id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/null')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(400);
      });

      //! SHOULD FAIL
      it('should fail non exiting id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/150044235')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(404);
      });

      //* SHOULD PASS
      it('should pass delete bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks/$S{bmId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
  });
});
