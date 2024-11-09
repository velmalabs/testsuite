#!/usr/bin/env node
import {program} from "./cli/program.js";

await program.run(process.argv);