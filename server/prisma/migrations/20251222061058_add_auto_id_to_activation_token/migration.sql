-- AlterTable
CREATE SEQUENCE "public".accountactivationtoken_id_seq;
ALTER TABLE "public"."AccountActivationToken" ALTER COLUMN "id" SET DEFAULT nextval('"public".accountactivationtoken_id_seq'),
ADD CONSTRAINT "AccountActivationToken_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE "public".accountactivationtoken_id_seq OWNED BY "public"."AccountActivationToken"."id";
