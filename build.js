/* FiveM Typescript Boilerplate by Whitigol */

const esbuild = require("esbuild");
const obfuscator = require("javascript-obfuscator");
const fs = require("fs");

const OBFUSCATE = true;

let compileCount = 0;

const production =
    process.argv.findIndex((argItem) => argItem === "--mode=production") >= 0;

const onRebuild = (context) => {
    return async (err, res) => {
        if (err) {
            return console.error(`[${context}]: Rebuild failed`, err);
        }

        Finish(context);

        compileCount++;
        console.log(
            `[${context}]: Rebuild succeeded (${compileCount})` +
                (res.warnings.length ? "Warnings: " + res.warnings : "")
        );
    };
};

const server = {
    platform: "node",
    target: ["node16"],
    format: "cjs",
};

const client = {
    platform: "browser",
    target: ["chrome93"],
    format: "iife",
};

for (const context of ["client", "server"]) {
    esbuild
        .build({
            bundle: true,
            entryPoints: [`${context}/${context}.ts`],
            outfile: `dist/${context}.js`,
            watch: production
                ? false
                : {
                      onRebuild: onRebuild(context),
                  },
            ...(context === "client" ? client : server),
        })
        .then(() => {
            Finish(context);

            console.log(`[${context}]: Built successfully!`);
        })
        .catch(() => process.exit(1));
}

function Finish(context) {
    // Obfuscate
    if (OBFUSCATE) {
        const code = fs.readFileSync(`dist/${context}.js`, "utf8");
        const obfuscatedCode = obfuscator.obfuscate(code, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 1,
            debugProtection: false,
            disableConsoleOutput: false,
        });

        fs.writeFileSync(
            `dist/${context}.js`,
            obfuscatedCode.getObfuscatedCode()
        );
    }

    // Move to output directory
    const dir = fs.readFileSync(`.dir`, "utf8");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    fs.copyFileSync(`config.json`, `${dir}/config.json`);
    fs.copyFileSync(`fxmanifest.lua`, `${dir}/fxmanifest.lua`);
    fs.existsSync(`${dir}/dist`) &&
        fs.rmSync(`${dir}/dist`, { recursive: true });
    fs.mkdirSync(`${dir}/dist`);
    fs.copyFileSync(`dist/client.js`, `${dir}/dist/client.js`);
    fs.copyFileSync(`dist/server.js`, `${dir}/dist/server.js`);

    // Stream Files
    if (fs.existsSync(`stream`)) {
        fs.existsSync(`${dir}/stream`) &&
            fs.rmSync(`${dir}/stream`, { recursive: true });
        fs.mkdirSync(`${dir}/stream`);

        // copy all files in stream, and subfolders, with files inside them, to the output dir/stream
        const copyStreamFiles = (dir, target) => {
            fs.readdirSync(dir).forEach((file) => {
                const filePath = `${dir}/${file}`;
                const targetPath = `${target}/${file}`;
                if (fs.lstatSync(filePath).isDirectory()) {
                    fs.mkdirSync(targetPath);
                    copyStreamFiles(filePath, targetPath);
                } else {
                    fs.copyFileSync(filePath, targetPath);
                }
            });
        };

        copyStreamFiles("stream", `${dir}/stream`);
    }

    // NUI Files
    if (fs.existsSync("nui")) {
        fs.existsSync(`${dir}/nui`) &&
            fs.rmSync(`${dir}/nui`, { recursive: true });
        fs.mkdirSync(`${dir}/nui`);

        // copy all files in nui, and subfolders, with files inside them, to the output dir/nui
        const copyNuiFiles = (dir, target) => {
            fs.readdirSync(dir).forEach((file) => {
                const filePath = `${dir}/${file}`;
                const targetPath = `${target}/${file}`;
                if (fs.lstatSync(filePath).isDirectory()) {
                    fs.mkdirSync(targetPath);
                    copyNuiFiles(filePath, targetPath);
                } else {
                    fs.copyFileSync(filePath, targetPath);
                }
            });
        };

        copyNuiFiles("nui", `${dir}/nui`);
    }
}
