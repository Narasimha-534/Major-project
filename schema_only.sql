--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: admin_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.admin_level AS ENUM (
    'department',
    'college'
);


ALTER TYPE public.admin_level OWNER TO postgres;

--
-- Name: department; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.department AS ENUM (
    'computer_science',
    'electrical_engineering',
    'mechanical_engineering',
    'physics',
    'mathematics'
);


ALTER TYPE public.department OWNER TO postgres;

--
-- Name: department_new; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.department_new AS ENUM (
    'CSE',
    'IT',
    'ECE',
    'EEE',
    'CIV',
    'MECH'
);


ALTER TYPE public.department_new OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'student',
    'faculty',
    'admin'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.achievements (
    id integer NOT NULL,
    type character varying(10),
    title text NOT NULL,
    description text,
    date date NOT NULL,
    category character varying(50),
    document_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    name text NOT NULL,
    department character varying(255) DEFAULT 'General'::character varying NOT NULL,
    user_id integer,
    CONSTRAINT achievements_type_check CHECK (((type)::text = ANY ((ARRAY['faculty'::character varying, 'student'::character varying])::text[])))
);


ALTER TABLE public.achievements OWNER TO postgres;

--
-- Name: achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.achievements_id_seq OWNER TO postgres;

--
-- Name: achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.achievements_id_seq OWNED BY public.achievements.id;


--
-- Name: admin_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_info (
    user_id integer NOT NULL,
    admin_id character varying(20) NOT NULL,
    admin_level public.admin_level NOT NULL,
    department public.department,
    CONSTRAINT check_department CHECK ((((admin_level = 'department'::public.admin_level) AND (department IS NOT NULL)) OR ((admin_level = 'college'::public.admin_level) AND (department IS NULL))))
);


ALTER TABLE public.admin_info OWNER TO postgres;

--
-- Name: annual_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.annual_reports (
    academic_year character varying(10) NOT NULL,
    report_url text NOT NULL,
    report_docx_url text NOT NULL
);


ALTER TABLE public.annual_reports OWNER TO postgres;

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    department character varying(100) NOT NULL,
    scheduled_date date NOT NULL,
    status character varying(50),
    report_url text,
    description text,
    end_date date,
    event_type character varying(255),
    dynamicfields jsonb DEFAULT '{}'::jsonb,
    report_docx_url text,
    CONSTRAINT events_status_check CHECK (((status)::text = ANY ((ARRAY['Scheduled'::character varying, 'Ongoing'::character varying, 'Completed'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: faculty_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculty_info (
    user_id integer NOT NULL,
    faculty_id character varying(20) NOT NULL,
    "position" character varying(100) NOT NULL
);


ALTER TABLE public.faculty_info OWNER TO postgres;

--
-- Name: semester_performance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semester_performance (
    id integer NOT NULL,
    department character varying(100) NOT NULL,
    batch character varying(10) NOT NULL,
    semester character varying(10) NOT NULL,
    pass_percentage double precision NOT NULL
);


ALTER TABLE public.semester_performance OWNER TO postgres;

--
-- Name: semester_performance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.semester_performance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.semester_performance_id_seq OWNER TO postgres;

--
-- Name: semester_performance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.semester_performance_id_seq OWNED BY public.semester_performance.id;


--
-- Name: student_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_info (
    user_id integer NOT NULL,
    student_id character varying(20) NOT NULL,
    year_of_study integer NOT NULL
);


ALTER TABLE public.student_info OWNER TO postgres;

--
-- Name: student_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_results (
    id integer NOT NULL,
    year integer NOT NULL,
    semester character varying(10) NOT NULL,
    student_name character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    marks integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.student_results OWNER TO postgres;

--
-- Name: student_results_cse_2021_2025_1; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_cse_2021_2025_1 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_cse_2021_2025_1_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_1_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_1_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_1_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_1_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_cse_2021_2025_1 OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_1_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_cse_2021_2025_1_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_cse_2021_2025_1_id_seq OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_1_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_cse_2021_2025_1_id_seq OWNED BY public.student_results_cse_2021_2025_1.id;


--
-- Name: student_results_cse_2021_2025_2; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_cse_2021_2025_2 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_cse_2021_2025_2_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_2_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_2_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_2_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_2_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_cse_2021_2025_2 OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_2_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_cse_2021_2025_2_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_cse_2021_2025_2_id_seq OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_2_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_cse_2021_2025_2_id_seq OWNED BY public.student_results_cse_2021_2025_2.id;


--
-- Name: student_results_cse_2021_2025_5; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_cse_2021_2025_5 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_cse_2021_2025_5_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_5_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_5_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_5_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_5_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_cse_2021_2025_5 OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_5_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_cse_2021_2025_5_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_cse_2021_2025_5_id_seq OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_5_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_cse_2021_2025_5_id_seq OWNED BY public.student_results_cse_2021_2025_5.id;


--
-- Name: student_results_cse_2021_2025_7; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_cse_2021_2025_7 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_cse_2021_2025_7_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_7_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_7_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_7_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_7_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_cse_2021_2025_7 OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_7_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_cse_2021_2025_7_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_cse_2021_2025_7_id_seq OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_7_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_cse_2021_2025_7_id_seq OWNED BY public.student_results_cse_2021_2025_7.id;


--
-- Name: student_results_cse_2021_2025_sem7; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_cse_2021_2025_sem7 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_cse_2021_2025_sem7_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_sem7_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_sem7_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_sem7_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_cse_2021_2025_sem7_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_cse_2021_2025_sem7 OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_sem7_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_cse_2021_2025_sem7_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_cse_2021_2025_sem7_id_seq OWNER TO college_app_user;

--
-- Name: student_results_cse_2021_2025_sem7_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_cse_2021_2025_sem7_id_seq OWNED BY public.student_results_cse_2021_2025_sem7.id;


--
-- Name: student_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.student_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_id_seq OWNER TO postgres;

--
-- Name: student_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.student_results_id_seq OWNED BY public.student_results.id;


--
-- Name: student_results_undefined_2021_2025_7; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_undefined_2021_2025_7 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_undefined_2021_2025_7_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_7_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_7_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_7_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_7_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_undefined_2021_2025_7 OWNER TO college_app_user;

--
-- Name: student_results_undefined_2021_2025_7_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_undefined_2021_2025_7_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_undefined_2021_2025_7_id_seq OWNER TO college_app_user;

--
-- Name: student_results_undefined_2021_2025_7_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_undefined_2021_2025_7_id_seq OWNED BY public.student_results_undefined_2021_2025_7.id;


--
-- Name: student_results_undefined_2021_2025_sem1; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_undefined_2021_2025_sem1 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_undefined_2021_2025_sem1_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_sem1_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_sem1_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_sem1_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_sem1_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_undefined_2021_2025_sem1 OWNER TO college_app_user;

--
-- Name: student_results_undefined_2021_2025_sem1_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_undefined_2021_2025_sem1_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_undefined_2021_2025_sem1_id_seq OWNER TO college_app_user;

--
-- Name: student_results_undefined_2021_2025_sem1_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_undefined_2021_2025_sem1_id_seq OWNED BY public.student_results_undefined_2021_2025_sem1.id;


--
-- Name: student_results_undefined_2021_2025_sem7; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_undefined_2021_2025_sem7 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_undefined_2021_2025_sem7_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_sem7_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_sem7_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_sem7_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_undefined_2021_2025_sem7_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_undefined_2021_2025_sem7 OWNER TO college_app_user;

--
-- Name: student_results_undefined_2021_2025_sem7_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_undefined_2021_2025_sem7_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_undefined_2021_2025_sem7_id_seq OWNER TO college_app_user;

--
-- Name: student_results_undefined_2021_2025_sem7_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_undefined_2021_2025_sem7_id_seq OWNED BY public.student_results_undefined_2021_2025_sem7.id;


--
-- Name: student_results_undefined_sem1; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_undefined_sem1 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_undefined_sem1_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_undefined_sem1_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_undefined_sem1_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_undefined_sem1_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_undefined_sem1_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_undefined_sem1 OWNER TO college_app_user;

--
-- Name: student_results_undefined_sem1_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_undefined_sem1_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_undefined_sem1_id_seq OWNER TO college_app_user;

--
-- Name: student_results_undefined_sem1_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_undefined_sem1_id_seq OWNED BY public.student_results_undefined_sem1.id;


--
-- Name: student_results_undefined_sem7; Type: TABLE; Schema: public; Owner: college_app_user
--

CREATE TABLE public.student_results_undefined_sem7 (
    id integer NOT NULL,
    roll_number character varying(50) NOT NULL,
    "IOT" integer,
    "BCT" integer,
    "ENTP" integer,
    "SQT" integer,
    "CS" integer,
    CONSTRAINT "student_results_undefined_sem7_BCT_check" CHECK ((("BCT" >= 0) AND ("BCT" <= 10))),
    CONSTRAINT "student_results_undefined_sem7_CS_check" CHECK ((("CS" >= 0) AND ("CS" <= 10))),
    CONSTRAINT "student_results_undefined_sem7_ENTP_check" CHECK ((("ENTP" >= 0) AND ("ENTP" <= 10))),
    CONSTRAINT "student_results_undefined_sem7_IOT_check" CHECK ((("IOT" >= 0) AND ("IOT" <= 10))),
    CONSTRAINT "student_results_undefined_sem7_SQT_check" CHECK ((("SQT" >= 0) AND ("SQT" <= 10)))
);


ALTER TABLE public.student_results_undefined_sem7 OWNER TO college_app_user;

--
-- Name: student_results_undefined_sem7_id_seq; Type: SEQUENCE; Schema: public; Owner: college_app_user
--

CREATE SEQUENCE public.student_results_undefined_sem7_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.student_results_undefined_sem7_id_seq OWNER TO college_app_user;

--
-- Name: student_results_undefined_sem7_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: college_app_user
--

ALTER SEQUENCE public.student_results_undefined_sem7_id_seq OWNED BY public.student_results_undefined_sem7.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    department public.department_new NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: achievements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements ALTER COLUMN id SET DEFAULT nextval('public.achievements_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: semester_performance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_performance ALTER COLUMN id SET DEFAULT nextval('public.semester_performance_id_seq'::regclass);


--
-- Name: student_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_results ALTER COLUMN id SET DEFAULT nextval('public.student_results_id_seq'::regclass);


--
-- Name: student_results_cse_2021_2025_1 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_1 ALTER COLUMN id SET DEFAULT nextval('public.student_results_cse_2021_2025_1_id_seq'::regclass);


--
-- Name: student_results_cse_2021_2025_2 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_2 ALTER COLUMN id SET DEFAULT nextval('public.student_results_cse_2021_2025_2_id_seq'::regclass);


--
-- Name: student_results_cse_2021_2025_5 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_5 ALTER COLUMN id SET DEFAULT nextval('public.student_results_cse_2021_2025_5_id_seq'::regclass);


--
-- Name: student_results_cse_2021_2025_7 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_7 ALTER COLUMN id SET DEFAULT nextval('public.student_results_cse_2021_2025_7_id_seq'::regclass);


--
-- Name: student_results_cse_2021_2025_sem7 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_sem7 ALTER COLUMN id SET DEFAULT nextval('public.student_results_cse_2021_2025_sem7_id_seq'::regclass);


--
-- Name: student_results_undefined_2021_2025_7 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_2021_2025_7 ALTER COLUMN id SET DEFAULT nextval('public.student_results_undefined_2021_2025_7_id_seq'::regclass);


--
-- Name: student_results_undefined_2021_2025_sem1 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_2021_2025_sem1 ALTER COLUMN id SET DEFAULT nextval('public.student_results_undefined_2021_2025_sem1_id_seq'::regclass);


--
-- Name: student_results_undefined_2021_2025_sem7 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_2021_2025_sem7 ALTER COLUMN id SET DEFAULT nextval('public.student_results_undefined_2021_2025_sem7_id_seq'::regclass);


--
-- Name: student_results_undefined_sem1 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_sem1 ALTER COLUMN id SET DEFAULT nextval('public.student_results_undefined_sem1_id_seq'::regclass);


--
-- Name: student_results_undefined_sem7 id; Type: DEFAULT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_sem7 ALTER COLUMN id SET DEFAULT nextval('public.student_results_undefined_sem7_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: admin_info admin_info_admin_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_info
    ADD CONSTRAINT admin_info_admin_id_key UNIQUE (admin_id);


--
-- Name: admin_info admin_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_info
    ADD CONSTRAINT admin_info_pkey PRIMARY KEY (user_id);


--
-- Name: annual_reports annual_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.annual_reports
    ADD CONSTRAINT annual_reports_pkey PRIMARY KEY (academic_year);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: faculty_info faculty_info_faculty_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty_info
    ADD CONSTRAINT faculty_info_faculty_id_key UNIQUE (faculty_id);


--
-- Name: faculty_info faculty_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty_info
    ADD CONSTRAINT faculty_info_pkey PRIMARY KEY (user_id);


--
-- Name: semester_performance semester_performance_department_batch_semester_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_performance
    ADD CONSTRAINT semester_performance_department_batch_semester_key UNIQUE (department, batch, semester);


--
-- Name: semester_performance semester_performance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_performance
    ADD CONSTRAINT semester_performance_pkey PRIMARY KEY (id);


--
-- Name: student_info student_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_info
    ADD CONSTRAINT student_info_pkey PRIMARY KEY (user_id);


--
-- Name: student_info student_info_student_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_info
    ADD CONSTRAINT student_info_student_id_key UNIQUE (student_id);


--
-- Name: student_results_cse_2021_2025_1 student_results_cse_2021_2025_1_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_1
    ADD CONSTRAINT student_results_cse_2021_2025_1_pkey PRIMARY KEY (id);


--
-- Name: student_results_cse_2021_2025_2 student_results_cse_2021_2025_2_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_2
    ADD CONSTRAINT student_results_cse_2021_2025_2_pkey PRIMARY KEY (id);


--
-- Name: student_results_cse_2021_2025_5 student_results_cse_2021_2025_5_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_5
    ADD CONSTRAINT student_results_cse_2021_2025_5_pkey PRIMARY KEY (id);


--
-- Name: student_results_cse_2021_2025_7 student_results_cse_2021_2025_7_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_7
    ADD CONSTRAINT student_results_cse_2021_2025_7_pkey PRIMARY KEY (id);


--
-- Name: student_results_cse_2021_2025_sem7 student_results_cse_2021_2025_sem7_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_cse_2021_2025_sem7
    ADD CONSTRAINT student_results_cse_2021_2025_sem7_pkey PRIMARY KEY (id);


--
-- Name: student_results student_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_results
    ADD CONSTRAINT student_results_pkey PRIMARY KEY (id);


--
-- Name: student_results_undefined_2021_2025_7 student_results_undefined_2021_2025_7_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_2021_2025_7
    ADD CONSTRAINT student_results_undefined_2021_2025_7_pkey PRIMARY KEY (id);


--
-- Name: student_results_undefined_2021_2025_sem1 student_results_undefined_2021_2025_sem1_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_2021_2025_sem1
    ADD CONSTRAINT student_results_undefined_2021_2025_sem1_pkey PRIMARY KEY (id);


--
-- Name: student_results_undefined_2021_2025_sem7 student_results_undefined_2021_2025_sem7_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_2021_2025_sem7
    ADD CONSTRAINT student_results_undefined_2021_2025_sem7_pkey PRIMARY KEY (id);


--
-- Name: student_results_undefined_sem1 student_results_undefined_sem1_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_sem1
    ADD CONSTRAINT student_results_undefined_sem1_pkey PRIMARY KEY (id);


--
-- Name: student_results_undefined_sem7 student_results_undefined_sem7_pkey; Type: CONSTRAINT; Schema: public; Owner: college_app_user
--

ALTER TABLE ONLY public.student_results_undefined_sem7
    ADD CONSTRAINT student_results_undefined_sem7_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: admin_info admin_info_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_info
    ADD CONSTRAINT admin_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: faculty_info faculty_info_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty_info
    ADD CONSTRAINT faculty_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: student_info student_info_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_info
    ADD CONSTRAINT student_info_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA public TO college_app_user;


--
-- Name: TABLE achievements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.achievements TO college_app_user;


--
-- Name: SEQUENCE achievements_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.achievements_id_seq TO college_app_user;


--
-- Name: TABLE admin_info; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_info TO college_app_user;


--
-- Name: TABLE annual_reports; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.annual_reports TO college_app_user;


--
-- Name: TABLE events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.events TO college_app_user;


--
-- Name: SEQUENCE events_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.events_id_seq TO college_app_user;


--
-- Name: TABLE faculty_info; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.faculty_info TO college_app_user;


--
-- Name: TABLE semester_performance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.semester_performance TO college_app_user;


--
-- Name: SEQUENCE semester_performance_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.semester_performance_id_seq TO college_app_user;


--
-- Name: TABLE student_info; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_info TO college_app_user;


--
-- Name: TABLE student_results; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.student_results TO college_app_user;


--
-- Name: SEQUENCE student_results_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.student_results_id_seq TO college_app_user;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO college_app_user;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO college_app_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO college_app_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO college_app_user;


--
-- PostgreSQL database dump complete
--

