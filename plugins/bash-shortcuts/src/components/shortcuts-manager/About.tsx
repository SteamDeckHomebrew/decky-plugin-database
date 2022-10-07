import { Fragment } from "react";

export function About() {
    return (
        <>
        <div>The Bash Shortcuts plugin was created to make launching programs from SteamOS easier, as it is kind of annoying to have to create 'non-steam game' shortcuts for things like web browsers.</div>
        <div>
            <h3>Adding Shortcuts:</h3>
            <div>A shortcut can be any valid terminal command.<br/>Examples:</div>
            <ul>
                <li>An application:</li>
                <ul>
                    <li>the absolute path to the executable</li>
                    <li>the application must be added to the $PATH variable</li>
                </ul>
                <li>A script file (must be the absolute path, and it must be executable)</li>
                <li>A bash command (like mkdir or ls)</li>
            </ul>
        </div>
        <br/>
        <div>Author: Tormak</div>
        </>
    )
}