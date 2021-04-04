import React, { useState } from "react";
import { Card, Divider, Modal } from "antd";
import { StarOutlined, EditOutlined, DeleteOutlined, StarFilled } from "@ant-design/icons"
import { Host } from "@/@types/entities";
import CoverImage from "./coverImg";
import styles from "./styles.less";
import { exec_ssh_connect } from "@/utils/system";


const hostCard = (props: { host: Host, onEdit: Function, onRemove: Function, onFixedChange: Function, actionBar: boolean }) => {
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
                    {
                        props.host.isFixed ?
                            <StarFilled style={{ color: "yellow" }} onClick={() => props.onFixedChange(props.host)} /> :
                            <StarOutlined onClick={() => props.onFixedChange(props.host)} />
                    }
                    {
                        props.actionBar &&
                        <>
                            <Divider type="vertical" />
                            <DeleteOutlined
                                onClick={(e) => {
                                    e.stopPropagation();
                                    props.onRemove(props.host._id)
                                }}
                            />
                        </>
                    }
                </div>
                <img src={CoverImage} />
            </div>
        }
        onDoubleClick={() => {
            const { host } = props;
            exec_ssh_connect(host.user, host.address, host.port, host.pemFile, window.terminalType);
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
