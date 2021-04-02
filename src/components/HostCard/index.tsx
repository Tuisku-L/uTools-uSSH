import React, { useState } from "react";
import { Card, Divider, Modal } from "antd";
import { ApiOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Host } from "@/@types/entities";
import CoverImage from "./coverImg";
import styles from "./styles.less";
import { exec_ssh_connect, execShell } from "@/utils/system";


const hostCard = (props: { host: Host, onEdit: Function, onRemove: Function }) => {
    return <Card
        hoverable
        cover={
            <div className={styles.hostImg}>
                <div className={styles.actionBox}>
                    <EditOutlined
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onEdit();
                        }}
                    />
                    <Divider type="vertical" />
                    <DeleteOutlined
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onRemove(props.host._id)
                        }}
                    />
                </div>
                <img src={CoverImage} />
            </div>
        }
        onDoubleClick={() => {
            const { host } = props;
            execShell(`chmod +x ${window.__dirname}/run.aspt`);
            exec_ssh_connect(host.user, host.address, host.port, host.pemFile);
        }}
        style={{ userSelect: "none" }}
    >
        <div
            style={{
                textAlign: "center",
            }}
        >
            {props.host.alias ?? props.host.address}
        </div>
    </Card>
}

export default hostCard;
